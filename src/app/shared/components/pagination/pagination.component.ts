import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    @if (totalPages > 1) {
      <div class="pagination">
        <span class="pagination__summary">Mostrando {{ startItem }} a {{ endItem }} de {{ totalElements }}</span>
        <div class="pagination__controls">
          <button class="icon-btn" [disabled]="page === 0" (click)="pageChange.emit(page - 1)" aria-label="Página anterior">
            &lsaquo;
          </button>
          <span class="pagination__page">{{ page + 1 }}</span>
          <button
            class="icon-btn"
            [disabled]="page >= totalPages - 1"
            (click)="pageChange.emit(page + 1)"
            aria-label="Próxima página"
          >
            &rsaquo;
          </button>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .pagination {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        font-size: 13px;
        color: var(--color-ink-soft);
      }
      .pagination__controls {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .pagination__page {
        min-width: 20px;
        text-align: center;
        font-weight: 600;
        color: var(--color-ink);
      }
    `,
  ],
})
export class PaginationComponent {
  @Input() page = 0;
  @Input() totalPages = 1;
  @Input() totalElements = 0;
  @Input() size = 10;
  @Output() pageChange = new EventEmitter<number>();

  get startItem(): number {
    return this.totalElements === 0 ? 0 : this.page * this.size + 1;
  }

  get endItem(): number {
    return Math.min((this.page + 1) * this.size, this.totalElements);
  }
}
