import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  template: `
    <div class="sm:flex justify-content-center align-items-center mt-8">
      <p-card
        header="{{ 'login.title' | translate }}"
        styleClass="w-full sm:w-30rem flex-1"
      >
        <router-outlet></router-outlet>
      </p-card>
    </div>
  `,
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {}
