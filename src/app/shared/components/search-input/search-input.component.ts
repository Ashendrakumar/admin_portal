import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from "rxjs";

@Component({
  selector: "app-search-input",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./search-input.component.html",
  styleUrl: "./search-input.component.scss",
})
export class SearchInputComponent implements OnInit, OnDestroy {
  @Input() placeholder = "Search...";
  @Input() debounce = 350;
  @Input() initialValue = "";
  @Output() search = new EventEmitter<string>();

  readonly searchControl = new FormControl("");
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    if (this.initialValue) {
      this.searchControl.setValue(this.initialValue, { emitEvent: false });
    }

    this.searchControl.valueChanges
      .pipe(
        debounceTime(this.debounce),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((value) => {
        this.search.emit(value ?? "");
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clear(): void {
    this.searchControl.setValue("");
    this.search.emit("");
  }
}
