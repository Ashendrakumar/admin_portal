import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "@core/services/auth.service";
import { ToastService } from "@core/services/toast.service";
import { LoaderComponent } from "@shared/components/loader/loader.component";
@Component({
  selector: "app-register-page",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./register-page.component.html",
  styleUrl: "./register-page.component.scss",
})
export class RegisterPageComponent implements OnInit {
  registerForm: FormGroup;
  readonly isLoading = signal(false);
  readonly showPassword = signal(false);
  readonly errorMessage = signal("");

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
  ) {
    this.registerForm = this.buildForm();
  }

  ngOnInit(): void {
    // Initialize form
  }

  isInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control?.invalid && control.touched);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set("");

    const { firstName, lastName, email, password } = this.registerForm.value;

    // For demo: register using the same login API with new credentials
    // In real app, you'd have a separate registration endpoint
    this.authService.login({ email, password }, true).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        this.toastService.success(
          `Welcome, ${firstName}!`,
          "Your account has been created successfully.",
        );
        this.router.navigate(["/dashboard"]);
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.message || "Registration failed. Please try again.",
        );
        this.toastService.error("Registration Failed", err.message);
      },
    });
  }

  private buildForm(): FormGroup {
    return this.fb.group(
      {
        firstName: ["", [Validators.required, Validators.minLength(2)]],
        lastName: ["", [Validators.required, Validators.minLength(2)]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", [Validators.required, Validators.minLength(8)]],
        agreeTerms: [false, Validators.requiredTrue],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  private passwordMatchValidator(
    group: FormGroup,
  ): { [key: string]: any } | null {
    const password = group.get("password")?.value;
    const confirmPassword = group.get("confirmPassword")?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      group.get("confirmPassword")?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else if (password === confirmPassword && confirmPassword) {
      group.get("confirmPassword")?.setErrors(null);
    }

    return null;
  }
}
