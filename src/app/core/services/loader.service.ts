import { Injectable, signal } from '@angular/core';

/**
 * LoaderService — Manages global and button-level loading states.
 * Uses Angular Signals for zero-subscription reactivity.
 */
@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _activeRequests = 0;
  private readonly _isLoading = signal(false);
  private readonly _loadingMessage = signal<string>('Loading...');

  readonly isLoading = this._isLoading.asReadonly();
  readonly loadingMessage = this._loadingMessage.asReadonly();

  show(message = 'Loading...'): void {
    this._activeRequests++;
    this._loadingMessage.set(message);
    this._isLoading.set(true);
  }

  hide(): void {
    this._activeRequests = Math.max(0, this._activeRequests - 1);
    if (this._activeRequests === 0) {
      this._isLoading.set(false);
    }
  }

  forceHide(): void {
    this._activeRequests = 0;
    this._isLoading.set(false);
  }
}
