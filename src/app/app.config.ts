import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import {
  provideRouter,
  // withPreloadAllModules,
  withInMemoryScrolling,
} from "@angular/router";
import {
  provideHttpClient,
  withInterceptors,
  withXsrfConfiguration,
} from "@angular/common/http";
import { appRoutes } from "./app.routes";
import { authInterceptor } from "./core/interceptors/auth.interceptor";

/**
 * Application Configuration
 * Configures:
 * - Router with lazy loading
 * - HTTP Client with interceptors
 * - Global providers
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      // withPreloadAllModules(),
      withInMemoryScrolling({
        scrollPositionRestoration: "enabled",
        anchorScrolling: "enabled",
      }),
    ),

    provideHttpClient(
      withInterceptors([authInterceptor]),
      withXsrfConfiguration({
        cookieName: "XSRF-TOKEN",
        headerName: "X-XSRF-TOKEN",
      }),
    ),
  ],
};
