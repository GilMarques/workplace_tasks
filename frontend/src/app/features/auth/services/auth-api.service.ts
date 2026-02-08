import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthTokenService } from '../../../core/auth/services/auth-token.service';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly apiUrl = environment.apiUrl;

  http = inject(HttpClient);
  tokenService = inject(AuthTokenService);

  login(credentials: { email: string; password: string }) {
    return this.http
      .post<{
        accessToken: string;
      }>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(tap((response) => this.tokenService.set(response.accessToken)));
  }

  signup(credentials: { email: string; password: string }) {
    return this.http.post<void>(`${this.apiUrl}/auth/signup`, credentials);
  }
}
