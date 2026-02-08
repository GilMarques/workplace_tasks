import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../../shared/types/PagedResult';
import { User, UserRole } from '../models/users.model';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly apiUrl = environment.apiUrl;

  http = inject(HttpClient);

  getUsers(page?: number, pageSize?: number, role?: UserRole) {
    let params = new HttpParams();

    if (page !== undefined) params = params.set('page', (page + 1).toString());
    if (pageSize !== undefined)
      params = params.set('pageSize', pageSize.toString());

    if (role !== undefined) params = params.set('role', role.toString());

    return this.http.get<PagedResult<User>>(`${this.apiUrl}/users`, { params });
  }

  createUser(user: { email: string; password: string; role: UserRole }) {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  updateUser(
    id: string,
    user: {
      email: string;
      password?: string;
      role: UserRole;
    },
  ) {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user);
  }

  deleteUser(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }
}
