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
import { MatIcon } from '@angular/material/icon';
import { UserService } from '../../../../core/auth/services/user.service';
import { User, UserRole } from '../../../../features/users/models/users.model';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { FormSelectComponent } from '../../../../shared/components/form-select/form-select.component';
import { AlertsService } from '../../../../shared/services/alerts-service/alerts.service';

export type UserModalResult =
  | {
      role: 'confirm';
      user: {
        email: string;
        password: string;
        role: UserRole;
      };
    }
  | {
      role: 'delete';
    }
  | {
      role: 'cancel';
    };

@Component({
  selector: 'user-modal',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    FormInputComponent,
    FormSelectComponent,

    MatChipsModule,

    MatIcon,
  ],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss',
})
export class UserModalComponent {
  private dialogRef = inject(MatDialogRef);
  private userService = inject(UserService);
  private matDialog = inject(MatDialog);
  private alerts = inject(AlertsService);

  data: {
    user: User | null;
  } = inject(MAT_DIALOG_DATA);

  currentUser = this.userService.currentUser;

  hidePassword = signal(true);
  togglePasswordHide(event: MouseEvent) {
    event.stopPropagation();
    this.hidePassword.set(!this.hidePassword());
  }

  form = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string | null>(null, [Validators.minLength(8)]),
    role: new FormControl<number>(2, [Validators.required]),
  });

  userRoles = [
    { value: 2, label: 'Member' },
    { value: 1, label: 'Manager' },
    { value: 0, label: 'Admin' },
  ];

  UserRole = UserRole;

  ngOnInit() {
    const user = this.data.user;

    if (user) {
      this.form.patchValue({
        email: user.email,

        role: user.role,
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return this.form.markAllAsTouched();

    const newUser = {
      email: this.form.value.email!,
      password: this.form.value.password ?? undefined,
      role: this.form.value.role ?? 0,
    };

    this.dialogRef.close({
      role: 'confirm',
      user: newUser,
    });
  }

  onCancel() {
    this.dialogRef.close({
      role: 'cancel',
    });
  }

  onDelete() {
    this.alerts
      .confirm({ message: 'Are you sure you want to delete this user?' })
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.dialogRef.close({
          role: 'delete',
        });
      });
  }
}
