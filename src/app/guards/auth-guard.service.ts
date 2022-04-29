import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const isAuthenticated = this.cookieService.check('get-package-auth');
    const isProtected = route.data['protected'];
    if (isAuthenticated && !isProtected) {
      return this.router.parseUrl('/');
    } else if (!isAuthenticated && isProtected) {
      return this.router.parseUrl('/login');
    }
    return true;
  }
}
