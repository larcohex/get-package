import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import languages from './constants/languages';

@Component({
  selector: 'app-root',
  template: `
    <header class="header">
      <h1 class="text-xl md:text-4xl">{{ 'title' | translate }}</h1>
      <div>
        <button
          pButton
          class="p-button-secondary p-button-text"
          (click)="op.toggle($event)"
        >
          {{ languageLabel }}
        </button>
        <p-overlayPanel #op>
          <ng-template pTemplate>
            <p-listbox
              [options]="languages"
              [(ngModel)]="language"
              optionLabel="label"
              optionValue="code"
              [style]="{ width: '15rem' }"
              (onChange)="op.hide()"
            ></p-listbox>
          </ng-template>
        </p-overlayPanel>
        <button
          pButton
          class="p-button-text"
          label="{{ 'logout' | translate }}"
          (click)="logout()"
          *ngIf="isLoggedIn"
        ></button>
      </div>
    </header>
    <main class="px-3">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      .header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 1rem;
        padding-right: 1rem;
        border-bottom: 1px solid var(--);
      }
    `,
  ],
})
export class AppComponent {
  languages = Object.keys(languages).map(code => ({
    code,
    label: (languages as any)[code],
  }));

  get language(): string {
    return this.translateService.currentLang;
  }

  set language(code: string) {
    this.translateService.use(code);
  }

  get languageLabel(): string {
    return (languages as any)[this.language];
  }

  get isLoggedIn(): boolean {
    return this.cookieService.check('get-package-auth');
  }

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private translateService: TranslateService,
    private config: PrimeNGConfig
  ) {
    this.translateService.setDefaultLang('en');
    this.translateService.use(localStorage.getItem('get-package-lang') || 'en');
    this.translateService.onLangChange.subscribe(({ lang }) => {
      localStorage.setItem('get-package-lang', lang);
      this.translateService.get('primeng').subscribe(res => {
        this.config.setTranslation(res);
      });
      if (lang === 'he') {
        document.body.setAttribute('dir', 'rtl');
      } else {
        document.body.removeAttribute('dir');
      }
    });
  }

  logout() {
    this.cookieService.delete('get-package-auth');
    this.router.navigate(['/login']);
  }
}
