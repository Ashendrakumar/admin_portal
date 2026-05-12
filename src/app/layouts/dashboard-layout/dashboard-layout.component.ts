import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { RouterModule, RouterOutlet } from "@angular/router";
import { AuthStateService } from "@core/services/auth-state.service";
import { AuthService } from "@core/services/auth.service";
import { ToastService } from "@core/services/toast.service";
import { LoaderComponent } from "@shared/components/loader/loader.component";
import { ConfirmDialogConfig } from "@core/models";
import { ConfirmDialogComponent } from "@shared/components/confirm-dialog/confirm-dialog.component";
import { ToastComponent } from "@shared/components/toast/toast.component";
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { SideBarComponent } from "./side-bar/side-bar.component";

@Component({
  selector: "app-dashboard-layout",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    ToastComponent,
    LoaderComponent,
    ConfirmDialogComponent,
    NavBarComponent,
    SideBarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./dashboard-layout.component.html",
  styleUrl: "./dashboard-layout.component.scss",
})
export class DashboardLayoutComponent {
  protected readonly authState = inject(AuthStateService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  readonly isConfirmOpen = signal(false);
  sidebarCollapsed = signal(false);

  readonly confirmConfig: ConfirmDialogConfig = {
    title: "Logout",
    message: "Are you sure you want to Logout ?",
    type: "warning",
    confirmLabel: "Logout",
  };

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }

  onLogoutClick(): void {
    this.isConfirmOpen.set(true);
  }

  logout(): void {
    setTimeout(() => this.authService.logout(), 500);
    this.toastService.info("Signing out...", "You have been logged out.");
    this.isConfirmOpen.set(false);
  }

  closeConfirm() {
    this.isConfirmOpen.set(false);
  }
}
