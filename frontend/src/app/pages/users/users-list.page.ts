import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UserService } from '../../core/auth/services/user.service';

import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { catchError, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { User, UserRole } from '../../features/users/models/users.model';
import { UsersApiService } from '../../features/users/services/users-api.service';
import { PagedResult } from '../../shared/types/PagedResult';
import { UserCardComponent } from './_components/user-card/user-card.component';
import {
  UserModalComponent,
  UserModalResult,
} from './_components/user-modal/user-modal.component';

@Component({
  selector: 'users-list',
  imports: [
    MatPaginatorModule,
    UserCardComponent,
    MatIcon,
    MatButtonModule,
    RouterLink,
    MatProgressSpinner,
    MatMenuModule,
    MatChipsModule,
  ],
  templateUrl: './users-list.page.html',
  styleUrl: './users-list.page.scss',
})
export class UsersListPageComponent {
  private destroy$ = new Subject<void>();
  private reloadUsers$ = new Subject<void>();
  private snackbar = inject(MatSnackBar);
  private usersApi = inject(UsersApiService);
  private userService = inject(UserService);
  private matDialog = inject(MatDialog);

  currentUser = this.userService.currentUser;

  UserRole = UserRole;

  usersLoading = signal(false);
  users = signal<PagedResult<User>>({
    items: [],
    totalCount: 0,
    limit: 10,
    offset: 0,
    currentPage: 1,
    totalPages: 0,
  });
  pageIndex = signal(0);
  pageSize = signal(10);
  roleFilter = signal<UserRole | undefined>(undefined);

  ngOnInit() {
    this.reloadUsers$
      .pipe(
        tap(() => this.usersLoading.set(true)),
        switchMap(() =>
          this.usersApi
            .getUsers(this.pageIndex(), this.pageSize(), this.roleFilter())
            .pipe(
              catchError((err) => {
                this.usersLoading.set(false);
                this.showRetryError('Failed to load users.');
                return of({
                  items: [],
                  totalCount: 0,
                  limit: 10,
                  offset: 0,
                  currentPage: 1,
                  totalPages: 0,
                });
              }),
            ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe((res) => {
        this.users.set(res);
        this.usersLoading.set(false);
      });

    this.loadUsers();
  }

  loadUsers() {
    this.reloadUsers$.next();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadUsers();
  }

  openUserModal(user: User | null) {
    const dialog = this.matDialog.open(UserModalComponent, {
      data: {
        user,
      },
    });

    dialog
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: UserModalResult) => {
        if (!result) return;

        if (result.role == 'confirm') {
          if (!user) {
            this.createUser(result.user);
          } else {
            this.updateUser(user.id, result.user);
          }
        }

        if (result.role == 'delete' && user) {
          this.deleteUser(user.id);
        }
      });
  }

  createUser(payload: { email: string; password: string; role: UserRole }) {
    this.usersApi
      .createUser(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          this.showError('Failed to create user.');
          console.error(err);
        },
      });
  }

  updateUser(
    id: string,
    payload: {
      email: string;
      password: string;
      role: UserRole;
    },
  ) {
    this.usersApi
      .updateUser(id, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          this.showError('Failed to update user.');
          console.error(err);
        },
      });
  }

  deleteUser(id: string) {
    this.usersApi
      .deleteUser(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          this.showError('Failed to delete user.');
          console.error(err);
        },
      });
  }

  setFilter(status?: UserRole) {
    this.roleFilter.set(status);
    this.loadUsers();
  }

  private showError(message: string) {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
    });
  }

  private showRetryError(message: string) {
    this.snackbar
      .open(message, 'Retry')
      .onAction()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadUsers();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
