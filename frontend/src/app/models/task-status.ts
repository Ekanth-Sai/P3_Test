export enum TaskStatus {
    PENDING = 'PENDING',
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED'
  }
  
  export const TaskStatusLabels: Record<TaskStatus, string> = {
    [TaskStatus.PENDING]: 'Pending',
    [TaskStatus.TODO]: 'Todo',
    [TaskStatus.IN_PROGRESS]: 'In Progress',
    [TaskStatus.COMPLETED]: 'Completed'
  };
  
  export function getNextStatus(currentStatus: TaskStatus): TaskStatus | null {
    switch (currentStatus) {
      case TaskStatus.PENDING:
        return TaskStatus.TODO;
      case TaskStatus.TODO:
        return TaskStatus.IN_PROGRESS;
      case TaskStatus.IN_PROGRESS:
        return TaskStatus.COMPLETED;
      case TaskStatus.COMPLETED:
        return null;
      default:
        return null;
    }
  }