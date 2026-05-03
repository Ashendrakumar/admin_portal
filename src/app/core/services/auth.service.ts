import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { environment } from "@environments/environment";
import { AuthStateService } from "./auth-state.service";
import { LoginRequest, LoginResponse, AuthUser, ApiResponse } from "../models";

/**
 * AuthService — Handles all authentication API interactions.
 * - login(): POST to /login, store token via AuthStateService
 * - logout(): Clear state, redirect to /auth/login
 * - isAuthenticated(): Synchronous check for guards
 */
@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authState: AuthStateService,
  ) {}

  /**
   * Login flow:
   * 1. POST credentials to /login || /register → get token
   * 2. GET user profile from /users/2 (reqres.in mock)
   * 3. Combine and store in AuthStateService
   */
  login(
    credentials: LoginRequest,
    isRegister: boolean = false,
  ): Observable<AuthUser> {
    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/${isRegister ? "register" : "login"}`,
        credentials,
      )
      .pipe(
        switchMap((loginRes) => {
          const token = loginRes.token;
          // Fetch user profile after successful login
          return this.http
            .get<ApiResponse<AuthUser>>(`${this.apiUrl}/users/2`)
            .pipe(
              map((userRes) => {
                const user: AuthUser = {
                  ...userRes.data,
                  role: "admin", // Assign default role for demo
                };
                this.authState.setAuthData(token, user);
                return user;
              }),
            );
        }),
        catchError((error) => {
          const message =
            error.error?.error ||
            error.message ||
            "Login failed. Please try again.";
          return throwError(() => new Error(message));
        }),
      );
  }

  /**
   * Clears local auth state and redirects to login
   */
  logout(): void {
    this.authState.clearAuthData();
    this.router.navigate(["/auth/login"]);
  }

  /**
   * Synchronous check — used by AuthGuard
   */
  isAuthenticated(): boolean {
    return !!this.authState.getToken();
  }

  /**
   * Get current user synchronously
   */
  getCurrentUser(): AuthUser | null {
    return this.authState.user();
  }
}
