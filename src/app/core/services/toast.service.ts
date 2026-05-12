import { Injectable, signal } from "@angular/core";
import { Toast, ToastType } from "../models";

/**
 * ToastService — Manages a stack of toast notifications.
 * Exposed as a signal for reactive UI updates.
 * Auto-dismisses after `duration` ms (default 4000).
 */
@Injectable({ providedIn: "root" })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);

  /** Public read-only signal for components to subscribe */
  readonly toasts = this._toasts.asReadonly();

  show(
    type: ToastType,
    title: string,
    message?: string,
    duration = 4000,
  ): void {
    const toast: Toast = {
      id: this.generateId(),
      type,
      title,
      message,
      duration,
      dismissible: true,
    };

    this._toasts.update((current) => [...current, toast]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(toast.id), duration);
    }
  }

  success(title: string, message?: string): void {
    this.show("success", title, message);
  }

  error(title: string, message?: string): void {
    this.show("error", title, message, 6000);
  }

  warning(title: string, message?: string): void {
    this.show("warning", title, message);
  }

  info(title: string, message?: string): void {
    this.show("info", title, message);
  }

  dismiss(id: string): void {
    this._toasts.update((current) => current.filter((t) => t.id !== id));
  }

  dismissAll(): void {
    this._toasts.set([]);
  }

  pauseTimer(id: string): void {}

  private generateId(): string {
    return `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }
}
