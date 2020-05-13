import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { PersonService } from '../services/person.service';

@Injectable({
  providedIn: 'root'
})
export class LoginRequiredGuard implements CanActivate {

  constructor(
    private router: Router,
    private personService: PersonService
  ) {}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      let isAuthenticated = this.personService.isAuthenticated();
      if (!isAuthenticated) {
        this.router.navigate(['/login'], { replaceUrl: true });
        return false;
      }
      return true;

  }
  
}
