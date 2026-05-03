# Architecture Overview

## Clean Architecture Principles

This project follows **Clean Architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER (Components, Pages)                 │
│  ├─ LoginComponent                                      │
│  ├─ DashboardLayoutComponent                              │
│  ├─ UserListComponent                                   │
│  └─ DashboardOverviewComponent                          │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│  APPLICATION LAYER (Services)                           │
│  ├─ AuthService (auth API calls)                        │
│  ├─ AuthStateService (state management)                 │
│  ├─ DashboardService (CRUD API calls)                   │
│  ├─ ToastService (notifications)                        │
│  └─ LoaderService (loading state)                       │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│  INFRASTRUCTURE LAYER (HTTP, Storage)                   │
│  ├─ HttpClient (HTTP requests)                          │
│  ├─ authInterceptor (request/response handling)         │
│  ├─ localStorage (token persistence)                    │
│  └─ ErrorHandling (centralized)                         │
└─────────────────────────────────────────────────────────┘
```

---

## Module Organization

### Core Module

**Purpose:** Singleton services and cross-cutting concerns

```
core/
├── guards/
│   ├── auth.guard.ts           # CanActivate, CanActivateChild
│   └── no-auth.guard.ts        # Prevents login page access when authenticated
├── interceptors/
│   └── auth.interceptor.ts     # Attaches JWT, handles errors
├── services/
│   ├── auth.service.ts         # Login/logout API
│   ├── auth-state.service.ts   # Global state (signals + BehaviorSubject)
│   ├── toast.service.ts        # Notification management
│   └── loader.service.ts       # Loading indicators
└── models/
    └── index.ts                # Shared interfaces & types
```

**Key Principle:** Services are provided in `root`, never imported in shared/feature modules.

---

### Shared Module

**Purpose:** Reusable, stateless UI components

```
shared/
├── components/
│   ├── table/                  # Dynamic data table with pagination
│   ├── toast/                  # Toast notification renderer
│   ├── loader/                 # Global & inline spinners
│   ├── search-bar/             # Debounced search input
│   ├── form-modal/             # Reusable form modal
│   └── confirm-dialog/         # Delete confirmation dialog
├── directives/                 # Custom structural/attribute directives
└── pipes/                      # Custom pipes (currency, date format, etc.)
```

**Key Principle:** No service injection except UI services. Pure presentational.

---

### Features Module

**Purpose:** Feature-specific components and business logic

```
features/
├── auth/
│   ├── components/
│   │   └── login/              # Login form & page
│   ├── services/
│   │   └── (inherits from core)
│   └── auth.routes.ts
│
└── dashboard/
    ├── components/
    │   ├── dashboard-home/     # Shell layout + routing
    │   ├── dashboard-overview/ # Stats & welcome
    │   └── user-list/          # CRUD interface
    ├── services/
    │   └── dashboard.service.ts # User API calls
    └── dashboard.routes.ts
```

**Key Principle:** Features are lazy-loaded. Each feature owns its routes and can import shared components.

---

## State Management

### Pattern: BehaviorSubject + Signals Hybrid

```typescript
// AuthStateService combines both approaches:

// ✓ Signals (modern, reactive, no subscriptions)
const user = authState.user(); // Direct value access
const isAuth = authState.isAuthenticated(); // Computed value

// ✓ Observables (RxJS interop, pipes)
authState.currentUser$.subscribe(...);
authState.isAuthenticated$.pipe(map(...)).subscribe(...);
```

**Benefits:**
- Backward compatible with RxJS
- Modern async-free API with signals
- Computed properties without subscriptions
- Automatic change detection triggers

---

## Authentication Flow (Detailed)

```
┌────────────────────────────────────────────────────────────┐
│ 1. LOGIN PAGE (NoAuthGuard prevents access if already auth)│
└────────────────────────────────────────────────────────────┘
                              ↓
            User submits credentials (email, password)
                              ↓
┌────────────────────────────────────────────────────────────┐
│ 2. AuthService.login()                                     │
│    POST /api/login {email, password}                       │
└────────────────────────────────────────────────────────────┘
                              ↓
        Backend returns: {token: "eyJhbGc..."}
                              ↓
┌────────────────────────────────────────────────────────────┐
│ 3. AuthService switchMap                                   │
│    GET /api/users/2 (fetch user profile)                   │
└────────────────────────────────────────────────────────────┘
                              ↓
           Backend returns user: {id, email, name}
                              ↓
┌────────────────────────────────────────────────────────────┐
│ 4. AuthStateService.setAuthData()                          │
│    ✓ Save token to localStorage                            │
│    ✓ Update signal: _tokenSignal.set(token)                │
│    ✓ Update signal: _userSignal.set(user)                  │
│    ✓ Update BehaviorSubject for RxJS subscribers           │
└────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────┐
│ 5. Router redirects to dashboard                           │
│    Protected routes (AuthGuard) now allow access           │
└────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────┐
│ 6. Subsequent API calls                                    │
│    authInterceptor:                                        │
│    ✓ Reads token from localStorage                         │
│    ✓ Attaches: Authorization: Bearer {token}               │
│    ✓ Catches 401 → triggers logout                         │
└────────────────────────────────────────────────────────────┘
```

---

## HTTP Interceptor Pipeline

```typescript
┌─────────────────────────────────────────────────────────┐
│ Outgoing Request                                        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ authInterceptor (HttpInterceptorFn)                     │
│ ✓ Get token from AuthStateService                       │
│ ✓ Clone request + set Authorization header              │
│ ✓ Forward to handler (HttpHandlerFn)                    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ HttpClient → Network                                    │
└─────────────────────────────────────────────────────────┘
                        ↓
         Backend Response (success or error)
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Error Handling (catchError operator)                    │
│                                                         │
│ if (401) → Clear auth state + redirect to login         │
│ if (403) → Show "Access Denied" toast                   │
│ if (500) → Show "Server Error" toast                    │
│ if (0)   → Show "Network Error" toast                   │
│                                                         │
│ Re-throw error for component-level handling             │
└─────────────────────────────────────────────────────────┘
```

---

## Performance Optimizations

### 1. Change Detection Strategy: OnPush

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  // Angular only checks this component when:
  // - An @Input changes (immutable reference)
  // - An event handler fires (click, input, etc.)
  // - An observable emits (async pipe)
  // - Manual cdr.markForCheck() is called
}
```

**Impact:** 10-100x faster rendering in large lists

---

### 2. TrackBy Function

```typescript
<app-table
  [data]="users"
  trackByKey="id"  // Compares user.id, not entire object
/>

// Without trackBy: DOM recreates every user element
// With trackBy: Only changed users are updated
```

**Impact:** Smooth UI, reduced DOM thrashing

---

### 3. RxJS Debouncing

```typescript
// SearchBarComponent
searchControl.valueChanges
  .pipe(
    debounceTime(350),        // Wait 350ms after user stops typing
    distinctUntilChanged(),    // Ignore duplicate values
    takeUntil(destroy$)        // Unsubscribe on component destroy
  )
  .subscribe(value => this.search.emit(value));
```

**Impact:** Fewer API calls (10+ → 1-2 per search)

---

### 4. Lazy Loading Feature Modules

```typescript
// app.routes.ts
const routes = [
  {
    path: 'dashboard',
    loadChildren: () => 
      import('./features/dashboard/dashboard.routes')
        .then(m => m.dashboardRoutes)
  }
];
```

**Impact:** Initial bundle split, faster first load

---

### 5. Signals (No Subscription Overhead)

```typescript
// ❌ Subscription approach (creates observable chain)
this.users$.pipe(
  map(...),
  filter(...),
  tap(...)
).subscribe(users => this.render(users));

// ✅ Signal approach (direct computation)
const users = computed(() => 
  this.filterUsers(this.allUsers())
);
```

**Impact:** Less memory, no unsubscribe boilerplate

---

## Error Handling Strategy

### Levels of Error Handling

```
┌─────────────────────────────────────┐
│ HTTP Interceptor                    │
│ ✓ Catches all HTTP errors           │
│ ✓ Shows toast notifications         │
│ ✓ Handles 401 (logout)              │
│ ✓ Handles 403 (forbidden)           │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│ Service Layer (Observable)          │
│ ✓ Catches RxJS errors               │
│ ✓ Maps errors to user-friendly msgs │
│ ✓ Provides fallback values           │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│ Component Layer                     │
│ ✓ Catches subscription errors       │
│ ✓ Shows component-specific UI       │
│ ✓ Retry logic (optional)            │
└─────────────────────────────────────┘
```

---

## Security Considerations

| Issue | Solution | Location |
|-------|----------|----------|
| **Unauthorized Access** | AuthGuard prevents route access | `core/guards/auth.guard.ts` |
| **Missing Token** | authInterceptor attaches JWT | `core/interceptors/auth.interceptor.ts` |
| **Expired Token** | 401 response triggers logout | `authInterceptor` |
| **Sensitive Data** | localStorage with key namespacing | `auth-state.service.ts` |
| **XSRF Attacks** | Angular's built-in XSRF protection | `app.config.ts` |
| **Form Injection** | Reactive Forms validators | All form components |

---

## Testing Strategy

```typescript
// Unit Tests (each service)
describe('AuthService', () => {
  it('should login and store token', () => {...});
  it('should handle login error', () => {...});
});

// Component Tests (with mocks)
describe('LoginComponent', () => {
  it('should display login form', () => {...});
  it('should call authService.login on submit', () => {...});
});

// E2E Tests (full flow)
describe('Auth Flow', () => {
  it('should login and navigate to dashboard', () => {...});
});
```

---

## Deployment Checklist

- [ ] Update `environment.prod.ts` with production API URL
- [ ] Run `npm run build:prod`
- [ ] Test in `dist/` folder locally
- [ ] Minify bundle size (check `ng build --stats-json`)
- [ ] Configure CORS on backend
- [ ] Set up HTTPS
- [ ] Configure CSP headers
- [ ] Test form validation with real API
- [ ] Verify error handling with real errors
- [ ] Load test with concurrent users
- [ ] Monitor performance (Lighthouse, Web Vitals)

---

## References

- **Angular Architecture Guide:** https://angular.io/guide/architecture
- **RxJS Best Practices:** https://rxjs.dev/guide/observable
- **Security Guide:** https://cheatsheetseries.owasp.org/
- **Performance Optimization:** https://angular.io/guide/change-detection

---

**Document Version:** 1.0  
**Last Updated:** May 2026
