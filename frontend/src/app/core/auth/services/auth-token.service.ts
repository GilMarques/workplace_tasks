import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
  private readonly TOKEN_KEY = 'access_token';

  set(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  get(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasToken(): boolean {
    const token = this.get();
    return !!token;
  }

  clear() {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
