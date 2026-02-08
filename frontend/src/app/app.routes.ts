import { Routes } from '@angular/router';
import { adminGuard } from './core/auth/guards/admin.guard';
import { authGuard } from './core/auth/guards/auth.guard';
import { userResolver } from './core/auth/resolvers/user.resolver';
import { LoginPageComponent } from './pages/_auth/login/login.page';
import { SignupPageComponent } from './pages/_auth/signup/signup.page';
import { TasksListPageComponent } from './pages/tasks/tasks-list.page';
import { UsersListPageComponent } from './pages/users/users-list.page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tasks',
  },

  {
    path: 'tasks',
    component: TasksListPageComponent,
    canActivate: [authGuard],
    resolve: {
      user: userResolver,
    },
  },

  {
    path: 'users',
    component: UsersListPageComponent,
    canActivate: [authGuard, adminGuard],
    resolve: {
      user: userResolver,
    },
  },

  {
    path: 'login',
    component: LoginPageComponent,
  },

  {
    path: 'signup',
    component: SignupPageComponent,
  },

  {
    path: '**',
    redirectTo: '',
  },
];
