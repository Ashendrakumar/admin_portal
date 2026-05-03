import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';
import { Toast } from '../../../core/models';

/**
 * ToastComponent — Renders a stack of toast notifications.
 * Positioned fixed in the top-right corner.
 * Uses OnPush for performance.
 */
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-container" role="region" aria-label="Notifications">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="toast toast--{{ toast.type }}"
          role="alert"
          [attr.aria-live]="toast.type === 'error' ? 'assertive' : 'polite'"
        >
          <div class="toast__icon">
            @switch (toast.type) {
              @case ('success') { <span>✓</span> }
              @case ('error') { <span>✕</span> }
              @case ('warning') { <span>⚠</span> }
              @case ('info') { <span>ℹ</span> }
            }
          </div>
          <div class="toast__content">
            <p class="toast__title">{{ toast.title }}</p>
            @if (toast.message) {
              <p class="toast__message">{{ toast.message }}</p>
            }
          </div>
          @if (toast.dismissible) {
            <button
              class="toast__close"
              (click)="toastService.dismiss(toast.id)"
              aria-label="Dismiss notification"
            >✕</button>
          }
          <div
            class="toast__progress"
            [style.animation-duration.ms]="toast.duration"
          ></div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: var(--z-toast);
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 380px;
      width: calc(100vw - 48px);
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 16px;
      border-radius: var(--radius-lg);
      border: 1px solid;
      background: var(--color-bg-elevated);
      box-shadow: var(--shadow-lg);
      animation: slideInRight 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: all;
      position: relative;
      overflow: hidden;

      &--success {
        border-color: rgba(16, 185, 129, 0.3);
        .toast__icon { background: rgba(16, 185, 129, 0.15); color: var(--color-accent-emerald); }
        .toast__progress { background: var(--color-accent-emerald); }
      }
      &--error {
        border-color: rgba(244, 63, 94, 0.3);
        .toast__icon { background: rgba(244, 63, 94, 0.15); color: var(--color-accent-rose); }
        .toast__progress { background: var(--color-accent-rose); }
      }
      &--warning {
        border-color: rgba(245, 158, 11, 0.3);
        .toast__icon { background: rgba(245, 158, 11, 0.12); color: var(--color-accent-amber); }
        .toast__progress { background: var(--color-accent-amber); }
      }
      &--info {
        border-color: rgba(0, 212, 255, 0.25);
        .toast__icon { background: rgba(0, 212, 255, 0.1); color: var(--color-accent-cyan); }
        .toast__progress { background: var(--color-accent-cyan); }
      }
    }

    .toast__icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .toast__content { flex: 1; min-width: 0; }

    .toast__title {
      font-family: var(--font-display);
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0;
    }

    .toast__message {
      font-size: 0.8125rem;
      color: var(--color-text-secondary);
      margin: 3px 0 0;
      line-height: 1.4;
    }

    .toast__close {
      background: none;
      border: none;
      color: var(--color-text-muted);
      cursor: pointer;
      font-size: 12px;
      padding: 2px 4px;
      line-height: 1;
      flex-shrink: 0;
      transition: color var(--transition-fast);
      &:hover { color: var(--color-text-primary); }
    }

    .toast__progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      width: 100%;
      transform-origin: left;
      animation: progressShrink linear forwards;
    }

    @keyframes progressShrink {
      from { transform: scaleX(1); }
      to { transform: scaleX(0); }
    }
  `],
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);

  trackToast(_: number, toast: Toast): string {
    return toast.id;
  }
}
