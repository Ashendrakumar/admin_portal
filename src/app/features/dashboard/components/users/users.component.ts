import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import {
  User,
  SortConfig,
  PaginationConfig,
  ConfirmDialogConfig,
  TableColumn,
  FilterConfig,
  UserFormData,
} from "@core/models";
import { ToastService } from "@core/services/toast.service";
import { DashboardService } from "@features/dashboard/services/dashboard.service";
import { Subject, takeUntil } from "rxjs";
import { CommonTableComponent } from "@shared/components/common-table/common-table.component";
import { SearchInputComponent } from "@shared/components/search-input/search-input.component";
import { FormModelComponent } from "./form-model/form-model.component";
import { ConfirmDialogComponent } from "@shared/components/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [
    CommonModule,
    ConfirmDialogComponent,
    CommonTableComponent,
    SearchInputComponent,
    FormModelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./users.component.html",
  styleUrl: "./users.component.scss",
})
export class UsersComponent implements OnInit, OnDestroy {
  private readonly dashboardService = inject(DashboardService);
  private readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  // --- State ---
  readonly isLoading = signal(false);
  readonly isModalOpen = signal(false);
  readonly isConfirmOpen = signal(false);
  readonly isSaving = signal(false);
  readonly isDeleting = signal(false);
  readonly selectedUser = signal<User | null>(null);
  readonly filteredUsers = signal<User[]>([]);

  private allUsers: User[] = [];
  private searchQuery = "";
  private roleFilter = "";
  private statusFilter = "";
  private userToDelete: User | null = null;

  sort: SortConfig | null = null;
  pagination: PaginationConfig = { page: 1, pageSize: 6, total: 0 };
  confirmConfig: ConfirmDialogConfig = {
    title: "Delete User",
    message: "This action cannot be undone.",
    type: "danger",
    confirmLabel: "Delete",
  };

  // Table column definitions // User
  readonly columns: TableColumn<any>[] = [
    { key: "name", label: "User", sortable: false, width: "280px" },
    { key: "role", label: "Role", sortable: true, width: "100px" },
    { key: "department", label: "Department", sortable: true },
    { key: "status", label: "Status", sortable: true, width: "100px" },
    { key: "joinDate", label: "Joined", sortable: true, width: "120px" },
  ];

  // Summary stats
  get stats() {
    const users = this.allUsers;
    return [
      {
        label: "Total Users",
        value: this.pagination.total,
        icon: "👥",
        bg: "rgba(37,99,235,0.1)",
        color: "#93c5fd",
      },
      {
        label: "Active",
        value: users.filter((u) => u.status === "active").length,
        icon: "✅",
        bg: "rgba(16,185,129,0.1)",
        color: "var(--color-accent-emerald)",
      },
      {
        label: "Admins",
        value: users.filter((u) => u.role === "admin").length,
        icon: "🛡️",
        bg: "rgba(245,158,11,0.1)",
        color: "var(--color-accent-amber)",
      },
      {
        label: "Departments",
        value: new Set(users.map((u) => u.department)).size,
        icon: "🏢",
        bg: "rgba(0,212,255,0.08)",
        color: "var(--color-accent-cyan)",
      },
    ];
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    const filters: FilterConfig = {
      page: this.pagination.page,
      per_page: this.pagination.pageSize,
      search: this.searchQuery,
    };

    this.dashboardService
      .getUsers(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.allUsers = res.data;
          this.pagination = {
            ...this.pagination,
            total: res.total,
          };
          this.applyClientFilters();
          this.isLoading.set(false);
          this.cdr.markForCheck();
        },
        error: () => {
          this.isLoading.set(false);
          this.toastService.error("Failed to load users", "Please try again.");
          this.cdr.markForCheck();
        },
      });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.pagination = { ...this.pagination, page: 1 };
    // this.loadUsers();
    this.applyClientFilters();
  }

  onRoleFilter(event: Event): void {
    this.roleFilter = (event.target as HTMLSelectElement).value;
    this.applyClientFilters();
  }

  onStatusFilter(event: Event): void {
    this.statusFilter = (event.target as HTMLSelectElement).value;
    this.applyClientFilters();
  }

  onSort(sort: SortConfig): void {
    this.sort = sort;
    const sorted = [...this.filteredUsers()].sort((a, b) => {
      const aVal = String(a[sort.column as keyof User] ?? "");
      const bVal = String(b[sort.column as keyof User] ?? "");
      return sort.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
    this.filteredUsers.set(sorted);
  }

  onPageChange(page: number): void {
    this.pagination = { ...this.pagination, page };
    this.loadUsers();
  }

  // --- Modal operations ---
  openAddModal(): void {
    this.selectedUser.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(user: User): void {
    this.selectedUser.set(user);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedUser.set(null);
  }

  onSave(formData: UserFormData): void {
    this.isSaving.set(true);
    const editUser = this.selectedUser();

    const request$ = editUser
      ? this.dashboardService.updateUser(editUser.id, {
          name: `${formData.first_name} ${formData.last_name}`,
          job: formData.job,
        })
      : this.dashboardService.createUser({
          name: `${formData.first_name} ${formData.last_name}`,
          job: formData.job,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
        });

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.closeModal();
        this.toastService.success(
          editUser ? "User Updated" : "User Created",
          editUser
            ? `${formData.first_name} has been updated.`
            : `${formData.first_name} has been added to the team.`,
        );

        // Optimistic UI update
        if (editUser) {
          this.allUsers = this.allUsers.map((u) =>
            u.id === editUser.id
              ? { ...u, ...formData, role: formData.role as User["role"] }
              : u,
          );
        } else {
          const newUser: User = {
            id: Date.now(),
            ...formData,
            avatar: `https://ui-avatars.com/api/?name=${formData.first_name}+${formData.last_name}`,
            status: "active",
            role: formData.role as User["role"],
            joinDate: new Date().toISOString().split("T")[0],
          };
          this.allUsers = [newUser, ...this.allUsers];
          this.pagination = {
            ...this.pagination,
            total: this.pagination.total + 1,
          };
        }
        this.applyClientFilters();
        this.cdr.markForCheck();
      },
      error: () => {
        this.isSaving.set(false);
        this.toastService.error(
          "Save Failed",
          "Could not save changes. Please try again.",
        );
      },
    });
  }

  // --- Delete operations ---
  openDeleteModal(user: User): void {
    this.userToDelete = user;
    this.confirmConfig = {
      title: "Delete User",
      message: `Are you sure you want to delete ${user.first_name} ${user.last_name}? This action cannot be undone.`,
      type: "danger",
      confirmLabel: "Delete User",
    };
    this.isConfirmOpen.set(true);
  }

  closeConfirm(): void {
    this.isConfirmOpen.set(false);
    this.userToDelete = null;
  }

  onDeleteConfirmed(): void {
    if (!this.userToDelete) return;
    const user = this.userToDelete;

    this.isDeleting.set(true);
    this.dashboardService
      .deleteUser(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isDeleting.set(false);
          this.closeConfirm();
          this.toastService.success(
            "User Deleted",
            `${user.first_name} has been removed.`,
          );

          // Optimistic UI update
          this.allUsers = this.allUsers.filter((u) => u.id !== user.id);
          this.pagination = {
            ...this.pagination,
            total: this.pagination.total - 1,
          };
          this.applyClientFilters();
          this.cdr.markForCheck();
        },
        error: () => {
          this.isDeleting.set(false);
          this.toastService.error(
            "Delete Failed",
            "Could not delete user. Please try again.",
          );
        },
      });
  }

  private applyClientFilters(): void {
    let result = [...this.allUsers];

    if (this.roleFilter) {
      result = result.filter((u) => u.role === this.roleFilter);
    }

    if (this.statusFilter) {
      result = result.filter((u) => u.status === this.statusFilter);
    }

    if (this.searchQuery) {
      result = result.filter(
        (u) =>
          (
            u.first_name.toLowerCase() +
            " " +
            u.last_name.toLowerCase()
          ).includes(this.searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(this.searchQuery.toLowerCase()),
      );
    }

    this.filteredUsers.set(result);
  }
}
