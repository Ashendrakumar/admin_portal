import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthUser } from '../models';
import { environment } from '@environments/environment';

/**
 * AuthStateService — Single source of truth for authentication state.
 * Uses both BehaviorSubjects (for RxJS interop) and Angular Signals (modern API).
 * Injectable as a singleton in the root injector.
 */
@Injectable({ providedIn: 'root' })
export class AuthStateService {
  // --- Private state ---
  private readonly _currentUser$ = new BehaviorSubject<AuthUser | null>(
    this.loadUserFromStorage()
  );
  private readonly _isAuthenticated$ = new BehaviorSubject<boolean>(
    !!this.loadTokenFromStorage()
  );

  // --- Signals (Angular 17+) ---
  private readonly _userSignal = signal<AuthUser | null>(this.loadUserFromStorage());
  private readonly _tokenSignal = signal<string | null>(this.loadTokenFromStorage());

  // --- Public Observables ---
  readonly currentUser$: Observable<AuthUser | null> = this._currentUser$.asObservable();
  readonly isAuthenticated$: Observable<boolean> = this._isAuthenticated$.asObservable();
  readonly userRole$: Observable<string | null> = this._currentUser$.pipe(
    map(user => user?.role ?? null)
  );

  // --- Public Signals ---
  readonly user = computed(() => this._userSignal());
  readonly token = computed(() => this._tokenSignal());
  readonly isAuthenticated = computed(() => !!this._tokenSignal());

  /**
   * Store token & user info after successful login
   */
  setAuthData(token: string, user: AuthUser): void {
    localStorage.setItem(environment.tokenKey, token);
    localStorage.setItem(environment.userKey, JSON.stringify(user));

    this._tokenSignal.set(token);
    this._userSignal.set(user);
    this._currentUser$.next(user);
    this._isAuthenticated$.next(true);
  }

  /**
   * Clear all auth state on logout
   */
  clearAuthData(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.userKey);

    this._tokenSignal.set(null);
    this._userSignal.set(null);
    this._currentUser$.next(null);
    this._isAuthenticated$.next(false);
  }

  /**
   * Get token synchronously (used by interceptor)
   */
  getToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    const user = this._userSignal();
    return user?.role === role;
  }

  // --- Private helpers ---
  private loadUserFromStorage(): AuthUser | null {
    try {
      const stored = localStorage.getItem(environment.userKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private loadTokenFromStorage(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }
}
