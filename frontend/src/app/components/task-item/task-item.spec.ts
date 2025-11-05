import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task';
import { Task, TaskUpdateRequest } from '../../models/task';
import { TaskStatus, TaskStatusLabels, getNextStatus } from '../../models/task-status';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css',
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() taskDeleted = new EventEmitter<number>();

  protected isEditing = signal(false);
  protected isExpanded = signal(false);
  protected editForm = signal<TaskUpdateRequest>({});
  protected loading = signal(false);
  protected error = signal<string | null>(null);

  protected readonly TaskStatus = TaskStatus;
  protected readonly TaskStatusLabels = TaskStatusLabels;

  constructor(private taskService: TaskService) {}

  protected getStatusClass(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.PENDING:
        return 'status-pending';
      case TaskStatus.TODO:
        return 'status-todo';
      case TaskStatus.IN_PROGRESS:
        return 'status-in-progress';
      case TaskStatus.COMPLETED:
        return 'status-completed';
      default:
        return '';
    }
  }

  protected canProgressStatus(): boolean {
    return this.task.status !== TaskStatus.COMPLETED;
  }

  protected getNextStatusLabel(): string {
    const next = getNextStatus(this.task.status);
    return next ? TaskStatusLabels[next] : '';
  }

  protected progressStatus(): void {
    const nextStatus = getNextStatus(this.task.status);
    if (!nextStatus) return;

    this.loading.set(true);
    this.error.set(null);

    this.taskService.updateTaskStatus(this.task.id, nextStatus).subscribe({
      next: (updated) => {
        this.taskUpdated.emit(updated);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to update status');
        this.loading.set(false);
        console.error('Error updating status:', err);
      },
    });
  }

  protected toggleEdit(): void {
    if (!this.isEditing()) {
      this.editForm.set({
        name: this.task.name,
        description: this.task.description,
        notes: this.task.notes,
      });
    }
    this.isEditing.update((v) => !v);
    this.error.set(null);
  }

  protected saveChanges(): void {
    const form = this.editForm();
    if (!form.name || form.name.trim().length < 3) {
      this.error.set('Task name must be at least 3 characters');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.taskService.updateTaskDetails(this.task.id, form).subscribe({
      next: (updated) => {
        this.taskUpdated.emit(updated);
        this.isEditing.set(false);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to update task');
        this.loading.set(false);
        console.error('Error updating task:', err);
      },
    });
  }

  protected deleteTask(): void {
    if (!confirm('Are you sure you want to delete this task?')) return;

    this.loading.set(true);
    this.error.set(null);

    this.taskService.deleteTask(this.task.id).subscribe({
      next: () => {
        this.taskDeleted.emit(this.task.id);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to delete task');
        this.loading.set(false);
        console.error('Error deleting task:', err);
      },
    });
  }

  protected toggleExpand(): void {
    this.isExpanded.update((v) => !v);
  }

  protected formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }
}