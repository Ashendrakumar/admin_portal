import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { AuthStateService } from "../services/auth-state.service";
import { ToastService } from "../services/toast.service";
import { environment } from "@environments/environment";

/**
 * AuthInterceptor (functional style — Angular 15+)
 * - Attaches Bearer token to all outgoing API requests
 * - Handles 401 responses by logging out the user
 * - Handles 403 (forbidden) with appropriate toast
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);
  const toast = inject(ToastService);

  const token = authState.getToken();
  // Clone request and attach Authorization header if token exists
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-api-key": environment.api_key,
        },
      })
    : req.clone({
        setHeaders: {
          "x-api-key": environment.api_key,
        },
      });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          // Token expired or invalid — clear state and redirect
          authState.clearAuthData();
          toast.error("Session Expired", "Please log in again.");
          router.navigate(["/auth/login"]);
          break;

        case 403:
          toast.error(
            "Access Denied",
            "You do not have permission for this action.",
          );
          break;

        case 0:
          toast.error("Network Error", "Unable to connect to the server.");
          break;

        case 500:
          toast.error(
            "Server Error",
            "An unexpected error occurred. Please try again.",
          );
          break;
      }

      return throwError(() => error);
    }),
  );
};
