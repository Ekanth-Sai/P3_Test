import { TaskStatus } from './task-status'; 

export interface Task {
  id: number;
  name: string;
  description?: string;
  notes?: string;
  status: TaskStatus;
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
