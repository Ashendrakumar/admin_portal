import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { ConfirmDialogConfig } from "@core/models";
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: "app-confirm-dialog",
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,

  templateUrl: "./confirm-dialog.component.html",
  styleUrl: "./confirm-dialog.component.scss",
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() config: ConfirmDialogConfig | null = null;
  @Input() isProcessing = false;
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
