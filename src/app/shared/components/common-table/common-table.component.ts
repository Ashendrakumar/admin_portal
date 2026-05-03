import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
} from "@angular/core";
import { TableColumn, SortConfig, PaginationConfig } from "@core/models";

@Component({
  selector: "app-common-table",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./common-table.component.html",
  styleUrl: "./common-table.component.scss",
})
export class CommonTableComponent implements OnChanges {
  @Input() columns: TableColumn[] = [];
  @Input() data: unknown[] = [];
  @Input() isLoading = false;
  @Input() sort: SortConfig | null = null;
  @Input() pagination: PaginationConfig | null = null;
  @Input() showActions = true;
  @Input() emptyTitle = "No records found";
  @Input() emptyMessage = "Try adjusting your search or filters";
  @Input() trackByKey = "id";

  @Output() sortChange = new EventEmitter<SortConfig>();
  @Output() pageChange = new EventEmitter<number>();

  @ContentChild("cellTemplate") cellTemplate?: TemplateRef<unknown>;
  @ContentChild("rowTemplate") rowTemplate?: TemplateRef<unknown>;

  skeletonRows = Array(5).fill(null);
  pageNumbers: number[] = [];
  totalPages = 1;
  pageStart = 0;
  pageEnd = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["pagination"] && this.pagination) {
      this.updatePagination();
    }
  }

  trackByFn(index: number, item: unknown): unknown {
    return (item as Record<string, unknown>)[this.trackByKey] ?? index;
  }

  getCellValue(row: unknown, col: TableColumn): string {
    const value = (row as Record<string, unknown>)[col.key];
    if (col.render) return col.render(value, row);
    return value != null ? String(value) : "—";
  }

  onSort(column: string): void {
    const direction =
      this.sort?.column === column && this.sort.direction === "asc"
        ? "desc"
        : "asc";
    this.sortChange.emit({ column, direction });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  private updatePagination(): void {
    if (!this.pagination) return;
    const { page, pageSize, total } = this.pagination;
    this.totalPages = Math.ceil(total / pageSize);
    this.pageStart = Math.min((page - 1) * pageSize + 1, total);
    this.pageEnd = Math.min(page * pageSize, total);

    // Generate visible page numbers (max 5)
    const start = Math.max(1, page - 2);
    const end = Math.min(this.totalPages, start + 4);
    this.pageNumbers = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i,
    );
  }
}
