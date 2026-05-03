// ============================================================
// SHARED MODELS & INTERFACES
// ============================================================

// --- Auth Models ---
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  role?: UserRole;
}

export type UserRole = "admin" | "editor" | "viewer";

// --- API Response Wrapper ---
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

// --- User Model (used in Dashboard) ---
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  role?: UserRole;
  status?: "active" | "inactive";
  department?: string;
  joinDate?: string;
}

export interface UserCreateRequest {
  name: string;
  job: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

export interface UserUpdateRequest extends Partial<UserCreateRequest> {
  id: number;
}

// --- Table Config ---
export interface TableColumn<T = unknown> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: unknown, row: T) => string;
}

export interface SortConfig {
  column: string;
  direction: "asc" | "desc";
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}

// --- Filter / Search ---
export interface FilterConfig {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  per_page?: number;
}

// --- Toast Notification ---
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
}

// --- Confirm Dialog ---
export interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: "danger" | "warning" | "info";
}

// --- UI State ---
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: number;
}

export interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  job: string;
  role: string;
  department: string;
}
