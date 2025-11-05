// frontend/src/app/models/task.ts
import { TaskStatus } from './task-status';

export interface Task {
  id: number;
  name: string;
  description?: string;
  notes?: string;
  status: TaskStatus;
  createdTime?: Date;
  updatedTime?: Date;
}

export interface TaskRequest {
  name: string;
  description?: string;
  notes?: string;
}

export interface TaskUpdateRequest {
  name?: string;
  description?: string;
  notes?: string;
  status?: TaskStatus;
}

export interface StatusUpdateRequest {
  status: TaskStatus;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
