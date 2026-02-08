import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../../../../core/auth/services/user.service';
import {
  Task,
  TaskStatus,
} from '../../../../features/tasks/models/tasks.model';
import { User, UserRole } from '../../../../features/users/models/users.model';
import { UsersApiService } from '../../../../features/users/services/users-api.service';
import { FormAutocompleteComponent } from '../../../../shared/components/form-autocomplete/form-autocomplete.component';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { FormSelectComponent } from '../../../../shared/components/form-select/form-select.component';
import { FormTextAreaComponent } from '../../../../shared/components/form-textarea/form-textarea.component';
import { AlertsService } from '../../../../shared/services/alerts-service/alerts.service';

export type TaskModalResult =
  | {
      role: 'confirm';
      task: {
        title?: string;
        description?: string;
        status: TaskStatus;
        assignedToUserId?: string;
      };
    }
  | {
      role: 'delete';
    }
  | {
      role: 'cancel';
    };

@Component({
  selector: 'task-modal',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    FormInputComponent,
    FormSelectComponent,
    FormAutocompleteComponent,
    MatChipsModule,
    FormTextAreaComponent,
  ],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss',
})
export class TaskModalComponent {
  private dialogRef = inject(MatDialogRef);
  private usersApi = inject(UsersApiService);
  private userService = inject(UserService);
  private matDialog = inject(MatDialog);
  private alerts = inject(AlertsService);

  data: {
    task: Task | null;
  } = inject(MAT_DIALOG_DATA);

  currentUser = this.userService.currentUser;

  form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>('', [Validators.required]),
    status: new FormControl<number>(2, [Validators.required]),
    user: new FormControl<string | null>(null, []),
  });

  taskStatus = [
    { value: 2, label: 'Pending' },
    { value: 1, label: 'In Progress' },
    { value: 0, label: 'Done' },
  ];

  users$ = new BehaviorSubject<User[]>([]);
  userDisplayWith = (user: User) => user.email;
  userValueWith = (user: User) => user.id;
  usersLoading = signal(false);
  UserRole = UserRole;

  ngOnInit() {
    const task = this.data.task;

    if (task) {
      this.form.patchValue({
        title: task.title,
        description: task.description,
        status: task.status,
        user: task.assignedToUserId ?? null,
      });

      if (
        this.currentUser.role == UserRole.Member &&
        task.createdByUserId != this.currentUser.id &&
        task.assignedToUserId == this.currentUser.id
      ) {
        this.form.controls.title.disable();
        this.form.controls.description.disable();
      }

      if (this.currentUser.role == UserRole.Member)
        this.form.controls.user.disable();
    }

    if (this.currentUser.role != UserRole.Member) {
      this.usersLoading.set(true);
      this.usersApi.getUsers().subscribe({
        next: (res) => {
          this.users$.next(res.items);
          this.usersLoading.set(false);
        },
        error: (err) => {
          this.usersLoading.set(false);
          console.error(err);
        },
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return this.form.markAllAsTouched();

    const newTask: {
      title?: string;
      description?: string;
      status: TaskStatus;
      assignedToUserId?: string;
    } = {
      title: this.form.value.title!,
      description: this.form.value.description!,
      status: this.form.value.status ?? 0,
      assignedToUserId: this.form.value.user ?? undefined,
    };

    this.dialogRef.close({
      role: 'confirm',
      task: newTask,
    });
  }

  onCancel() {
    this.dialogRef.close({
      role: 'cancel',
    });
  }

  onDelete() {
    this.alerts
      .confirm({ message: 'Are you sure you want to delete this task?' })
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.dialogRef.close({
          role: 'delete',
        });
      });
  }
}
