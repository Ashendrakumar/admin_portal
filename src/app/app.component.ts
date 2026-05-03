import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * AppComponent — Root component, outlet for all routes.
 * This is the bootstrapped component from main.ts.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {}
