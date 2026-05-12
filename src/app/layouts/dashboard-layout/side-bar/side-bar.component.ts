import { style } from "@angular/animations";
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { RouterLinkActive, RouterModule } from "@angular/router";
import { AuthStateService } from "@core/services/auth-state.service";
import { DASHBOARD_LAYOUT } from "../const";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: "app-side-bar",
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./side-bar.component.html",
  styleUrl: "./side-bar.component.scss",
})
export class SideBarComponent {
  protected readonly authState = inject(AuthStateService);
  private readonly domSanitizer = inject(DomSanitizer);
  protected readonly navItems = DASHBOARD_LAYOUT.NAV_ITEMS;

  sidebarCollapsed = input();
  toggleSidebar = output();
  logoutClick = output();

  toggle() {
    this.toggleSidebar.emit();
  }

  onLogout() {
    this.logoutClick.emit();
  }

  getIcon(icon: string): SafeHtml {
    const icons: Record<string, string> = {
      dashboard: `
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      `,

      users: `
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      `,

      analytics: `
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
      `,

      settings: `
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.07 4.93L4.93 19.07M4.93 4.93l14.14 14.14" />
        </svg>
      `,
    };

    return this.domSanitizer.bypassSecurityTrustHtml(icons[icon] || "");
  }
}
