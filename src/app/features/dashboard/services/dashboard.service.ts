import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map, delay } from "rxjs/operators";
import { environment } from "@environments/environment";
import {
  User,
  PaginatedResponse,
  ApiResponse,
  UserCreateRequest,
  FilterConfig,
} from "@core/models";

/**
 * DashboardService — Handles all CRUD operations for users.
 * Uses reqres.in as a realistic mock REST API.
 * Includes server-side pagination, search, and filtering.
 */
@Injectable({ providedIn: "root" })
export class DashboardService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Fetch paginated list of users
   * GET /users?page=1&per_page=6
   */
  getUsers(filters: FilterConfig = {}): Observable<PaginatedResponse<User>> {
    let params = new HttpParams()
      .set("page", filters.page ?? 1)
      .set("per_page", filters.per_page ?? 6);

    // reqres.in doesn't support real search, but we pass params for demo
    if (filters.search) {
      params = params.set("search", filters.search);
    }

    return this.http
      .get<PaginatedResponse<User>>(`${this.apiUrl}/users`, { params })
      .pipe(
        delay(environment.apiRequestDelay),
        map((res) => ({
          ...res,
          // Enrich with mock metadata for demo purposes
          data: res.data.map((user: any) => ({
            ...user,
            status: Math.random() > 0.3 ? "active" : ("inactive" as const),
            department: this.randomDepartment(),
            role: this.randomRole(),
            joinDate: this.randomDate(),
          })),
        })),
        catchError(this.handleError),
      );
  }

  /**
   * Fetch a single user by ID
   * GET /users/:id
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/users/${id}`).pipe(
      delay(environment.apiRequestDelay),
      map((res) => res.data),
      catchError(this.handleError),
    );
  }

  /**
   * Create a new user
   * POST /users
   */
  createUser(user: UserCreateRequest): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/users`, user)
      .pipe(delay(environment.apiRequestDelay), catchError(this.handleError));
  }

  /**
   * Update an existing user
   * PUT /users/:id
   */
  updateUser(id: number, user: Partial<UserCreateRequest>): Observable<User> {
    return this.http
      .put<User>(`${this.apiUrl}/users/${id}`, user)
      .pipe(delay(environment.apiRequestDelay), catchError(this.handleError));
  }

  /**
   * Delete a user by ID
   * DELETE /users/:id
   */
  deleteUser(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/users/${id}`)
      .pipe(delay(environment.apiRequestDelay), catchError(this.handleError));
  }

  // --- Private Helpers ---
  private handleError(error: unknown) {
    const message =
      (error as { message?: string })?.message ?? "An error occurred";
    return throwError(() => new Error(message));
  }

  private randomDepartment(): string {
    const departments = [
      "Engineering",
      "Design",
      "Marketing",
      "Sales",
      "HR",
      "Finance",
      "Operations",
    ];
    return departments[Math.floor(Math.random() * departments.length)];
  }

  private randomRole(): "admin" | "editor" | "viewer" {
    const roles: ("admin" | "editor" | "viewer")[] = [
      "admin",
      "editor",
      "viewer",
    ];
    return roles[Math.floor(Math.random() * roles.length)];
  }

  private randomDate(): string {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const date = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
    return date.toISOString().split("T")[0];
  }
}
