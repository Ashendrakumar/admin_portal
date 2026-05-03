import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute, RouterLink } from "@angular/router";
import { AuthService } from "@core/services/auth.service";
import { ToastService } from "@core/services/toast.service";
import { LoaderComponent } from "@shared/components/loader/loader.component";

@Component({
  selector: "app-login-page",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./login-page.component.html",
  styleUrl: "./login-page.component.scss",
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  readonly isLoading = signal(false);
  readonly showPassword = signal(false);
  readonly errorMessage = signal("");

  private returnUrl = "/dashboard";

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.returnUrl =
      this.route.snapshot.queryParams["returnUrl"] ?? "/dashboard";
  }

  isInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control?.invalid && control.touched);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set("");

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        this.toastService.success(
          `Welcome back, ${user.first_name}!`,
          "You have successfully signed in.",
        );
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.message || "Login failed. Please check your credentials.",
        );
        this.toastService.error("Authentication Failed", err.message);
      },
    });
  }
}
