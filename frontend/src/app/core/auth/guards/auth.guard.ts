import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthTokenService } from '../services/auth-token.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const tokenService = inject(AuthTokenService);

  if (!tokenService.hasToken()) {
    tokenService.clear();
    return router.createUrlTree(['/login']);
  }

  return true;
};
