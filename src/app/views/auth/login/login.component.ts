import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  message: { severity: 'success' | 'error'; text: string } | null = null;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private translateService: TranslateService,
    private authService: AuthService
  ) {}

  login() {
    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe(data => {
        if (data.res === 'unknown request') {
          this.translateService
            .get('message.error.login')
            .subscribe(message => {
              this.displayMessage({
                severity: 'error',
                text: message,
              });
            });
        } else {
          this.translateService
            .get('message.success.login')
            .subscribe(message => {
              this.displayMessage({
                severity: 'success',
                text: message,
              });
            });
          setTimeout(() => {
            this.cookieService.set('get-package-auth', data.token!, {
              path: '/',
            });
            this.router.navigate(['/']);
          }, 1000);
        }
      });
    }
  }

  displayMessage(message: { severity: 'success' | 'error'; text: string }) {
    this.message = message;
    setTimeout(() => {
      this.message = null;
    }, 3000);
  }
}
