import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task, TaskUpdateRequest } from '../../models/task';
import {
  TaskStatus,
  TaskStatusLabels,
  getNextStatus,
} from '../../models/task-status';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './task-item.html',
  styleUrls: ['./task-item.css'],
})
export class TaskItemComponent implements OnInit {
  @Input({ required: true }) task!: Task;
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() taskDeleted = new EventEmitter<number>();

  protected loading = signal(false);
  protected error = signal<string | null>(null);

  protected readonly TaskStatus = TaskStatus;
  protected readonly TaskStatusLabels = TaskStatusLabels;

  protected isEditing = signal(false);
  protected editableTask!: TaskUpdateRequest;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.resetEditableTask();
  }

  private resetEditableTask(): void {
    this.editableTask = { ...this.task };
  }

  toggleEdit(): void {
    this.isEditing.set(!this.isEditing());
    if (!this.isEditing()) {
      this.resetEditableTask(); 
    }
  }

  saveTask(): void {
    this.loading.set(true);
    this.taskService.updateTask(this.task.id, this.editableTask).subscribe({
      next: (updatedTask) => {
        this.taskUpdated.emit(updatedTask);
        this.isEditing.set(false);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to save task');
        this.loading.set(false);
      },
    });
  }

  updateStatus(): void {
    const next = getNextStatus(this.task.status);
    if (next === null) return;

    this.loading.set(true);

    this.taskService.updateStatus(this.task.id, next).subscribe({
      next: (updated: Task) => {
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

  getStatusClass(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.PENDING:
        return 'bg-secondary';
      case TaskStatus.TODO:
        return 'bg-primary';
      case TaskStatus.IN_PROGRESS:
        return 'bg-warning text-dark';
      case TaskStatus.COMPLETED:
        return 'bg-success';
      default:
        return 'bg-light';
    }
  }
}
