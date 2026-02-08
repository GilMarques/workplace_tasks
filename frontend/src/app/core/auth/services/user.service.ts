import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { UserDetails, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  private readonly user$ = new BehaviorSubject<UserDetails | null>(null);

  loadMe(): Observable<UserDetails> {
    const cached = this.user$.value;
    if (cached) return of(cached);

    return this.http
      .get<UserDetails>('http://localhost:5000/users/me')
      .pipe(tap((user) => this.user$.next(user)));
  }

  get currentUser(): UserDetails {
    const user = this.user$.value;
    if (!user) throw new Error('User not loaded');
    return user;
  }

  get currentUser$() {
    return this.user$.asObservable();
  }

  get isAdmin$() {
    return this.user$.pipe(map((u) => !!u && u.role === UserRole.Admin));
  }

  get isAdmin(): boolean {
    return this.currentUser.role === UserRole.Admin;
  }

  clear() {
    this.user$.next(null);
  }
}
