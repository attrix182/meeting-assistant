import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const storedCongregation = localStorage.getItem('congregation');

    if (!storedCongregation) {
      // No está logueado
      this.router.navigate(['/login']);
      return false;
    }

    const congregation = JSON.parse(storedCongregation);
    const urlCongregationId = route.params['id'] || state.url.split('/')[3];

    if (urlCongregationId && urlCongregationId !== congregation.id) {
      // El ID en la URL no coincide con el logueado

      this.router.navigate(['/dashboard/', congregation.id]);
      return false;
    }

    // Todo correcto
    return true;
  }
}
