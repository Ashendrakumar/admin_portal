# Secure Admin Portal

**Enterprise-grade Angular 17+ Admin Dashboard** — Production-ready authentication, CRUD operations, and modern UI/UX patterns.

![Version](https://img.shields.io/badge/version-1.0.0-blue) ![Angular](https://img.shields.io/badge/angular-17%2B-red) ![TypeScript](https://img.shields.io/badge/typescript-5.4-blue) ![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Overview

**Secure Admin Portal** is a professional, production-ready Angular application demonstrating enterprise architecture patterns, security best practices, and modern UX/UI design principles.

### Key Features

✅ **Enterprise Authentication** — JWT-based login with secure token management  
✅ **Protected Routes** — AuthGuard prevents unauthorized access  
✅ **Token Interceptor** — Automatically attaches JWT to all API requests  
✅ **CRUD Operations** — Create, read, update, delete user records  
✅ **Server-side Pagination** — Efficient data handling for large datasets  
✅ **Search & Filter** — RxJS debounce, role/status filters  
✅ **State Management** — BehaviorSubject + Angular Signals  
✅ **Reusable Components** — Table, modal, toast, loader, search bar  
✅ **Modern Design System** — Custom CSS variables, responsive layout  
✅ **OnPush Change Detection** — Performance-optimized rendering  

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm 9+
- **Angular CLI** 17+

### Installation

1. **Clone or extract the project**
   ```bash
   cd secure-admin-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   ng serve
   ```

4. **Open in browser**
   ```
   http://localhost:4200
   ```

### Demo Credentials

Use these credentials to test the application:

```
Email:    eve.holt@reqres.in
Password: cityslicka
```

> **Note:** The app uses [reqres.in](https://reqres.in) as a mock REST API for demonstration.

---

## 📁 Project Structure

```
secure-admin-portal/
├── src/
│   ├── app/
│   │   ├── core/                    # Singleton services, guards, interceptors
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts           # Route protection
│   │   │   │   └── no-auth.guard.ts        # Prevent authenticated users from login
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts     # JWT token attachment
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts         # Authentication API calls
│   │   │   │   ├── auth-state.service.ts   # Global auth state
│   │   │   │   ├── toast.service.ts        # Notifications
│   │   │   │   └── loader.service.ts       # Loading indicators
│   │   │   └── models/
│   │   │       └── index.ts                # Shared interfaces & types
│   │   │
│   │   ├── shared/                 # Reusable components, pipes, directives
│   │   │   └── components/
│   │   │       ├── table/          # Dynamic data table
│   │   │       ├── toast/          # Toast notifications
│   │   │       ├── loader/         # Global & inline spinners
│   │   │       ├── search-bar/     # Debounced search input
│   │   │       ├── form-modal/     # Reusable form modal
│   │   │       └── confirm-dialog/ # Delete confirmation
│   │   │
│   │   ├── features/               # Feature modules (lazy-loaded)
│   │   │   ├── auth/               # Authentication module
│   │   │   │   ├── components/
│   │   │   │   │   └── login-page/      # Login page
│   │   │   │   ├── services/
│   │   │   │   └── auth.routes.ts
│   │   │   │
│   │   │   └── dashboard/          # Dashboard module
│   │   │       ├── components/
│   │   │       │   ├── dashboard-home/      # Shell layout with sidebar
│   │   │       │   ├── dashboard-overview/  # Stats & welcome
│   │   │       │   └── user-list/           # CRUD interface
│   │   │       ├── services/
│   │   │       │   └── dashboard.service.ts # API calls
│   │   │       └── dashboard.routes.ts
│   │   │
│   │   ├── app.component.ts        # Root component
│   │   ├── app.config.ts           # App configuration
│   │   └── app.routes.ts           # Main routing config
│   │
│   ├── environments/
│   │   ├── environment.ts          # Development
│   │   └── environment.prod.ts     # Production
│   │
│   ├── styles.scss                 # Global styles & design system
│   ├── index.html                  # HTML template
│   ├── main.ts                     # Bootstrap
│   └── favicon.ico
│
├── angular.json                    # Angular CLI config
├── tsconfig.json                   # TypeScript config
├── package.json                    # Dependencies
├── README.md                       # This file
└── .gitignore
```

---

## 🔐 Authentication Flow

### Login Process

```
1. User enters email & password
   ↓
2. LoginComponent sends POST /api/login
   ↓
3. Backend returns JWT token
   ↓
4. AuthService fetches user profile (GET /api/users/2)
   ↓
5. AuthStateService stores token + user data in localStorage
   ↓
6. User redirected to dashboard
```

### Protected Routes

All dashboard routes are protected by `AuthGuard`:

```typescript
// If not authenticated → redirected to /auth/login
// returnUrl query param preserves intended destination
```

### Token Persistence

- **Stored in:** `localStorage` (key: `sap_auth_token`)
- **Synced on:** App initialization (AuthStateService)
- **Cleared on:** Logout or 401 response

---

## 🔗 HTTP Interceptor

The `authInterceptor` automatically:

✓ Attaches JWT token to every request  
✓ Handles 401 (session expired)  
✓ Handles 403 (forbidden)  
✓ Handles network errors  
✓ Shows appropriate toast messages  

### Example

```typescript
// No manual header setup needed:
this.http.get('/api/users').subscribe(...);
// Becomes: GET /api/users Authorization: Bearer <token>
```

---

## 📊 CRUD Operations (User Management)

### Create User

```typescript
dashboardService.createUser({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@company.com',
  job: 'Software Engineer',
  role: 'editor',
  department: 'Engineering'
})
```

### Read Users (Paginated)

```typescript
dashboardService.getUsers({
  page: 1,
  per_page: 6,
  search: 'john'
})
```

### Update User

```typescript
dashboardService.updateUser(userId, {
  first_name: 'Jane',
  job: 'Senior Engineer'
})
```

### Delete User

```typescript
dashboardService.deleteUser(userId)
```

---

## 🎯 State Management

### BehaviorSubject Pattern (RxJS)

```typescript
// AuthStateService uses BehaviorSubject for backward compatibility
authState.currentUser$.subscribe(user => {
  console.log('Current user:', user);
});

authState.isAuthenticated$.subscribe(isAuth => {
  console.log('Is authenticated:', isAuth);
});
```

### Angular Signals (Modern API)

```typescript
// Signals for reactive updates without subscriptions
const user = authState.user(); // null | AuthUser
const isAuth = authState.isAuthenticated(); // boolean
```

---

## 🎨 UI Components

### Toast Notifications

```typescript
toastService.success('Success', 'Operation completed');
toastService.error('Error', 'Something went wrong');
toastService.warning('Warning', 'Please review');
toastService.info('Info', 'Additional information');
```

### Global Loader

```typescript
loaderService.show('Processing...');
// ... async operation
loaderService.hide();

// Force hide (in case of multiple requests)
loaderService.forceHide();
```

### Reusable Table

```typescript
<app-common-table
  [columns]="tableColumns"
  [data]="userData"
  [isLoading]="isLoading()"
  [pagination]="paginationConfig"
  [sort]="sortConfig"
  (sortChange)="onSort($event)"
  (pageChange)="onPageChange($event)"
>
  <!-- Custom cell templates optional -->
</app-common-table>
```

### Search Bar with Debounce

```typescript
<app-search-input
  placeholder="Search users..."
  [debounce]="350"
  (search)="onSearch($event)"
/>

// Emits after 350ms of inactivity
```

---

## ⚡ Performance Optimizations

### Change Detection Strategy

All components use `ChangeDetectionStrategy.OnPush`:

```typescript
@Component({
  selector: 'app-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

This disables automatic change detection and requires manual triggers, significantly improving rendering performance.

### TrackBy in ngFor

```typescript
<app-table
  [data]="users"
  trackByKey="id"  // Uses ID for DOM reconciliation
/>
```

### Lazy Loading

Feature modules are lazy-loaded:

```typescript
// app.routes.ts
{
  path: 'auth',
  loadChildren: () => import('./features/auth/auth.routes')
}
```

### RxJS Debounce

Search input is debounced to reduce API calls:

```typescript
// SearchBarComponent
searchControl.valueChanges
  .pipe(
    debounceTime(350),
    distinctUntilChanged()
  )
  .subscribe(value => this.search.emit(value));
```

---

## 🛡️ Security Features

| Feature | Implementation |
|---------|-----------------|
| **JWT Authentication** | Bearer token in Authorization header |
| **Secure Token Storage** | localStorage with key namespacing |
| **Route Guards** | `AuthGuard` prevents unauthorized access |
| **Session Management** | 401 triggers automatic logout |
| **XSRF Protection** | Built-in Angular XSRF configuration |
| **Input Validation** | Reactive Forms with Validators |
| **Error Handling** | Centralized error responses |

---

## 🎬 Build & Deployment

### Development Build

```bash
npm start
# Starts dev server on http://localhost:4200
```

### Production Build

```bash
npm run build:prod
# Creates optimized build in dist/secure-admin-portal/
```

### Build Output

```
dist/secure-admin-portal/
├── index.html
├── styles.css (bundled & minified)
├── main.js (bundled & optimized)
├── polyfills.js
└── ...
```

### Deployment

Deploy the `dist/` folder to:

- **Static Hosting:** Firebase, Vercel, Netlify, GitHub Pages
- **Server:** Express, Node.js, AWS S3, Azure Static Web Apps
- **Docker:** Build Docker image with Angular dist as static assets

---

## 🔧 Environment Configuration

### Development (`environment.ts`)

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://reqres.in/api',
  tokenKey: 'sap_auth_token',
};
```

### Production (`environment.prod.ts`)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.production-server.com/api',
  tokenKey: 'sap_auth_token',
};
```

### Using Environment

```typescript
import { environment } from '@environments/environment';

constructor(private http: HttpClient) {
  const apiUrl = environment.apiUrl;
  const isProduction = environment.production;
}
```

---

## 📱 Responsive Design

The application is fully responsive:

- **Desktop** (1024px+) — Full sidebar, multi-column layouts
- **Tablet** (768px-1023px) — Collapsible sidebar, adjusted grids
- **Mobile** (< 768px) — Drawer sidebar, single-column layouts

CSS utilities: `.hide-mobile`, `.hide-desktop`, `.hide-tablet`

---

## 🧪 Testing (Optional)

### Unit Tests

```bash
npm test
```

### E2E Tests

```bash
npm run e2e
```

> *Testing setup can be added using Jasmine/Karma or Cypress*

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| **@angular/common** | Common directives, pipes |
| **@angular/forms** | Reactive Forms |
| **@angular/router** | Routing & navigation |
| **@angular/platform-browser** | DOM API |
| **rxjs** | Reactive programming |
| **typescript** | Language support |

---

## 🎓 Learning Resources

- **[Angular Official Docs](https://angular.io/docs)**
- **[RxJS Guide](https://rxjs.dev/guide)**
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)**
- **[Reactive Forms](https://angular.io/guide/reactive-forms)**
- **[HTTP Client](https://angular.io/guide/http)**
- **[Routing & Navigation](https://angular.io/guide/routing-overview)**

---

## 🤝 Contributing

This is a portfolio/demo project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see LICENSE file for details.

---

## 🙋 Support

For issues, questions, or suggestions:

1. **GitHub Issues** — Report bugs or feature requests
2. **Discussions** — Ask questions and share ideas
3. **Email** — Contact via project documentation

---

## 🎯 Future Enhancements

- [ ] Role-based access control (RBAC)
- [ ] Advanced analytics dashboard
- [ ] Real-time notifications via WebSocket
- [ ] Audit logging & activity tracking
- [ ] Bulk operations (import/export users)
- [ ] Two-factor authentication (2FA)
- [ ] Dark/light theme toggle
- [ ] Internationalization (i18n)
- [ ] End-to-end testing suite
- [ ] Storybook component library

---

## 📞 Contact & Credits

**Built with Angular 17+, TypeScript, and modern web standards.**

*An enterprise-ready template for admin dashboards, CRM systems, and management applications.*

---

**Last Updated:** May 2026  
**Version:** 1.0.0  
**Status:** Production-Ready ✅
