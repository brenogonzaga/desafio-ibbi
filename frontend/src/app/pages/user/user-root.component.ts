import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@root/app/components/navbar/navbar.component';

@Component({
  selector: 'user-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar />
    <div class="main-content">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class UserRootComponent {}
