import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Task,
  TaskRequest,
  TaskUpdateRequest,
    PageResponse,
  StatusUpdateRequest
} from '../models/task';
import { TaskStatus } from '../models/task-status';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly apiUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {}

  createTask(request: TaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, request);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  getAllTasks(
    page: number = 0,
    size: number = 10,
    search?: string,
    status?: TaskStatus,
    sortBy: string = 'updatedTime',
    sortDir: string = 'DESC'
  ): Observable<PageResponse<Task>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    if (search) {
      params = params.set('search', search);
    }

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PageResponse<Task>>(this.apiUrl, { params });
  }

  updateTaskStatus(id: number, status: TaskStatus): Observable<Task> {
    const request: StatusUpdateRequest = { status };
    return this.http.patch<Task>(`${this.apiUrl}/${id}/status`, request);
  }

  updateTaskDetails(id: number, request: TaskUpdateRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, request);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}