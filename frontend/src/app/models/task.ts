export interface Task {
    id: number;
    name: string;
    description?: string;
    notes?: string;
    status: TaskStatus;
    createdTime: string;
    updatedTime: string;
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
  