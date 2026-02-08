import { Component, inject, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import { AuthApiService } from '../../../features/auth/services/auth-api.service';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';
@Component({
  selector: 'auth-signup-page',
  imports: [
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RouterLink,
    FormInputComponent,
  ],
  templateUrl: './signup.page.html',
  styleUrl: './signup.page.scss',
})
export class SignupPageComponent {
  private authApiService = inject(AuthApiService);
  private router = inject(Router);
  private snackbar = inject(MatSnackBar);

  form = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  hidePassword = signal(true);
  loading = signal(false);
  togglePasswordHide(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  subscription?: Subscription;
  onSignup() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    this.loading.set(true);

    const credentials = {
      email: this.form.value.email!,
      password: this.form.value.password!,
    };

    this.subscription?.unsubscribe();
    this.subscription = this.authApiService
      .signup(credentials)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['login']);
        },
        error: (err) => {
          if (err?.status === 409) {
            this.snackbar.open('Email already in use', 'Close', {
              duration: 5000,
            });
          } else {
            this.snackbar.open('Unexpected error occurred', 'Close', {
              duration: 5000,
            });
          }

          console.error('Signup failed', err);
        },
      });
  }
}
