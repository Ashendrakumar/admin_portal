import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { User, UserFormData } from "@core/models";
import { LoaderComponent } from "@shared/components/loader/loader.component";
@Component({
  selector: "app-form-model",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./form-model.component.html",
  styleUrl: "./form-model.component.scss",
})
export class FormModelComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() editUser: User | null = null;
  @Input() isSaving = false;
  @Output() save = new EventEmitter<UserFormData>();
  @Output() close = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["editUser"]) {
      if (this.editUser) {
        this.form.patchValue({
          first_name: this.editUser.first_name,
          last_name: this.editUser.last_name,
          email: this.editUser.email,
          role: this.editUser.role ?? "",
          department: this.editUser.department ?? "",
          job: "",
        });
      } else {
        this.form.reset();
      }
    }
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.value as UserFormData);
  }

  onClose(): void {
    this.form.reset();
    this.close.emit();
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      first_name: ["", [Validators.required, Validators.minLength(2)]],
      last_name: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      role: ["", Validators.required],
      department: ["", Validators.required],
      job: [""],
    });
  }
}
