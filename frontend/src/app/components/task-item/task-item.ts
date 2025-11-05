import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task, TaskUpdateRequest } from '../../models/task';
import { TaskStatus, TaskStatusLabels, getNextStatus } from '../../models/task-status';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-item.html',
  styleUrls: ['./task-item.css'],
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() taskDeleted = new EventEmitter<number>();

  protected loading = signal(false);
  protected error = signal<string | null>(null);

  protected readonly TaskStatus = TaskStatus;
  protected readonly TaskStatusLabels = TaskStatusLabels;

  constructor(private taskService: TaskService) {}

  updateStatus(): void {
    const next = getNextStatus(this.task.status);
    this.loading.set(true);

    this.taskService.updateTaskStatus(this.task.id, next).subscribe({
      next: (updated) => {
        this.taskUpdated.emit(updated);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to update status');
        this.loading.set(false);
      },
    });
  }

  deleteTask(): void {
    this.loading.set(true);
    this.taskService.deleteTask(this.task.id).subscribe({
      next: () => {
        this.taskDeleted.emit(this.task.id);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to delete task');
        this.loading.set(false);
      },
    });
  }
}
