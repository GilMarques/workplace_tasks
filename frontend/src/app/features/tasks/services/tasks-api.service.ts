import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../../shared/types/PagedResult';
import { Task, TaskStatus } from '../models/tasks.model';

@Injectable({ providedIn: 'root' })
export class TasksApiService {
  private readonly apiUrl = environment.apiUrl;

  http = inject(HttpClient);

  getTasks(page: number, pageSize: number, status?: TaskStatus) {
    let params = new HttpParams()
      .set('page', (page + 1).toString())
      .set('pageSize', pageSize.toString());

    if (status !== undefined) {
      params = params.set('status', status);
    }

    return this.http.get<PagedResult<Task>>(`${this.apiUrl}/tasks`, { params });
  }
  createTask(task: {
    title?: string;
    description?: string;
    status?: number;
    assignedToUserId?: string;
  }) {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, task);
  }

  updateTask(
    id: string,
    task: {
      title?: string;
      description?: string;
      status?: number;
      assignedToUserId?: string;
    },
  ) {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, task);
  }

  deleteTask(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`);
  }
}
