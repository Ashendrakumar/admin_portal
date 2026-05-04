import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Toast } from "@core/models";
import { ToastService } from "@core/services/toast.service";

@Component({
  selector: "app-toast",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./toast.component.html",
  styleUrl: "./toast.component.scss",
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);

  trackToast(_: number, toast: Toast): string {
    return toast.id;
  }
}
