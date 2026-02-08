import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { UserRole } from '../models/user.model';
import { AuthTokenService } from '../services/auth-token.service';
import { UserService } from '../services/user.service';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const tokenService = inject(AuthTokenService);
  const userService = inject(UserService);

  if (!tokenService.hasToken()) {
    tokenService.clear();
    return router.createUrlTree(['/login']);
  }

  return userService.loadMe().pipe(
    map((user) =>
      user.role === UserRole.Admin ? true : router.createUrlTree(['/']),
    ),
    catchError(() => {
      tokenService.clear();
      userService.clear();
      return of(router.createUrlTree(['/login']));
    }),
  );
};
