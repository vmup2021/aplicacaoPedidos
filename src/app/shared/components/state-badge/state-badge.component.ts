import { Component, Input } from '@angular/core';
import { RequestState, REQUEST_STATE_LABEL } from '../../../core/models/enums';

@Component({
  selector: 'app-state-badge',
  standalone: true,
  template: `<span class="badge" [class]="'badge--' + state.toLowerCase()">{{ label }}</span>`,
  styles: [
    `
      .badge {
        display: inline-flex;
        align-items: center;
        padding: 3px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
      }
      .badge--pendente {
        background: var(--color-warning-tint);
        color: var(--color-warning);
      }
      .badge--aprovado {
        background: var(--color-success-tint);
        color: var(--color-success);
      }
      .badge--rejeitado {
        background: var(--color-danger-tint);
        color: var(--color-danger);
      }
    `,
  ],
})
export class StateBadgeComponent {
  @Input({ required: true }) state!: RequestState;

  get label(): string {
    return REQUEST_STATE_LABEL[this.state] ?? this.state;
  }
}
