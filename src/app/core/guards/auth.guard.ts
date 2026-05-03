import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * AuthGuard — Protects routes that require authentication.
 * Redirects unauthenticated users to /auth/login,
 * preserving the attempted URL as a redirect param.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkAuth(state.url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkAuth(state.url);
  }

  private checkAuth(url: string): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Store attempted URL for redirect after login
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: url },
    });
    return false;
  }
}
