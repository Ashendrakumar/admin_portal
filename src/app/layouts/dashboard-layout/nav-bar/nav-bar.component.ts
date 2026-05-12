import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from "@angular/core";
import { AuthStateService } from "@core/services/auth-state.service";

@Component({
  selector: "app-nav-bar",
  standalone: true,
  imports: [],
  host: { class: "nav-bar" },
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./nav-bar.component.html",
  styleUrl: "./nav-bar.component.scss",
})
export class NavBarComponent {
  protected readonly authState = inject(AuthStateService);
  toggleSidebar = output();
  logoutClick = output();

  toggle() {
    this.toggleSidebar.emit();
  }

  onLogout() {
    this.logoutClick.emit();
  }
}
