import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/enums';

/**
 * Restricts a route to a given set of UserRole values.
 * Usage in routes: canActivate: [roleGuard([UserRole.APROVADOR])]
 */
export const roleGuard = (allowed: UserRole[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const role = auth.currentUser()?.perfil;

    if (role && allowed.includes(role)) return true;

    router.navigate(['/dashboard']);
    return false;
  };
};
