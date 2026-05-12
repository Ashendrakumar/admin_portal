import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from "@angular/core";
import { LoaderService } from "@core/services/loader.service";

@Component({
  selector: "app-loader",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./loader.component.html",
  styleUrl: "./loader.component.scss",
})
export class LoaderComponent {
  @Input() isGlobal = false;
  @Input() size: "sm" | "md" | "lg" = "md";

  protected readonly loaderService = inject(LoaderService);
}
