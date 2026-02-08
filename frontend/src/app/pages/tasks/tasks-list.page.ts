import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UserService } from '../../core/auth/services/user.service';
import { Task, TaskStatus } from '../../features/tasks/models/tasks.model';

import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { catchError, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { TasksApiService } from '../../features/tasks/services/tasks-api.service';
import { UserRole } from '../../features/users/models/users.model';
import { PagedResult } from '../../shared/types/PagedResult';
import { TaskCardComponent } from './_components/task-card/task-card.component';
import {
  TaskModalComponent,
  TaskModalResult,
} from './_components/task-modal/task-modal.component';

@Component({
  selector: 'tasks-list',
  imports: [
    MatPaginatorModule,
    TaskCardComponent,
    MatIcon,
    MatButtonModule,
    RouterLink,
    MatProgressSpinner,
    MatMenuModule,
    MatChipsModule,
  ],
  templateUrl: './tasks-list.page.html',
  styleUrl: './tasks-list.page.scss',
})
export class TasksListPageComponent {
  private destroy$ = new Subject<void>();
  private reloadTasks$ = new Subject<void>();
  private snackbar = inject(MatSnackBar);
  private tasksApi = inject(TasksApiService);
  private userService = inject(UserService);
  private matDialog = inject(MatDialog);

  user = this.userService.currentUser;

  UserRole = UserRole;

  tasksLoading = signal(false);
  tasks = signal<PagedResult<Task>>({
    items: [],
    totalCount: 0,
    limit: 10,
    offset: 0,
    currentPage: 1,
    totalPages: 0,
  });
  pageIndex = signal(0);
  pageSize = signal(10);
  statusFilter = signal<TaskStatus | undefined>(undefined);
  TaskStatus = TaskStatus;

  ngOnInit() {
    this.reloadTasks$
      .pipe(
        tap(() => this.tasksLoading.set(true)),
        switchMap(() =>
          this.tasksApi
            .getTasks(this.pageIndex(), this.pageSize(), this.statusFilter())
            .pipe(
              catchError((err) => {
                this.tasksLoading.set(false);
                this.showRetryError('Failed to load tasks.');
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
      .subscribe({
        next: (res) => {
          this.tasks.set(res);
          this.tasksLoading.set(false);
        },
        error: (err) => {
          this.tasksLoading.set(false);
          console.error(err);
        },
      });

    this.loadTasks();
  }

  loadTasks() {
    this.reloadTasks$.next();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadTasks();
  }

  openTaskModal(task: Task | null) {
    const dialog = this.matDialog.open(TaskModalComponent, {
      data: {
        task,
      },
    });

    dialog
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: TaskModalResult) => {
        if (!result) return;

        if (result.role == 'confirm') {
          if (!task) {
            this.createTask(result.task);
          } else {
            this.updateTask(task.id, result.task);
          }
        }

        if (result.role == 'delete' && task) {
          this.deleteTask(task.id);
        }
      });
  }

  createTask(payload: {
    title?: string;
    description?: string;
    status: TaskStatus;
    assignedToUserId?: string;
  }) {
    this.tasksApi
      .createTask(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (err) => {
          this.showError('Failed to create task.');
          console.error(err);
        },
      });
  }

  updateTask(
    id: string,
    payload: {
      title?: string;
      description?: string;
      status: TaskStatus;
      assignedToUserId?: string;
    },
  ) {
    this.tasksApi
      .updateTask(id, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (err) => {
          this.showError('Failed to update task.');
          console.error(err);
        },
      });
  }

  deleteTask(id: string) {
    this.tasksApi
      .deleteTask(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (err) => {
          this.showError('Failed to delete task.');
          console.error(err);
        },
      });
  }

  setFilter(status?: TaskStatus) {
    this.statusFilter.set(status);
    this.loadTasks();
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
        this.loadTasks();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
