import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Route, Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard  {
  constructor(private authService: AuthService, private router: Router) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkAuth();
  }

  canLoad(route: Route) {
    return this.checkAuth();
  }

  private checkAuth() {
    if (this.authService.isAuth()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}