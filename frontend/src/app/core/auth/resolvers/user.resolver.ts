import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const userResolver = () => {
  const userService = inject(UserService);
  return userService.loadMe();
};
