import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task';
import { Task, TaskRequest } from '../../models/task';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskFormComponent {
  @Output() taskCreated = new EventEmitter<Task>();

  protected formData = signal<TaskRequest>({
    name: '',
    description: '',
    notes: '',
  });

  protected loading = signal(false);
  protected error = signal<string | null>(null);
  protected validationErrors = signal<Record<string, string>>({});

  constructor(private taskService: TaskService) {}

  protected validateForm(): boolean {
    const errors: Record<string, string> = {};
    const data = this.formData();

    if (!data.name || data.name.trim().length < 3) {
      errors['name'] = 'Task name must be at least 3 characters';
    } else if (data.name.length > 100) {
      errors['name'] = 'Task name must not exceed 100 characters';
    }

    if (data.description && data.description.length > 500) {
      errors['description'] = 'Description must not exceed 500 characters';
    }

    if (data.notes && data.notes.length > 1000) {
      errors['notes'] = 'Notes must not exceed 1000 characters';
    }

    this.validationErrors.set(errors);
    return Object.keys(errors).length === 0;
  }

  protected onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const request: TaskRequest = {
      name: this.formData().name.trim(),
      description: this.formData().description?.trim() || undefined,
      notes: this.formData().notes?.trim() || undefined,
    };

    this.taskService.createTask(request).subscribe({
      next: (task) => {
        this.taskCreated.emit(task);
        this.resetForm();
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to create task. Please try again.');
        this.loading.set(false);
        console.error('Error creating task:', err);
      },
    });
  }

  protected resetForm(): void {
    this.formData.set({
      name: '',
      description: '',
      notes: '',
    });
    this.validationErrors.set({});
    this.error.set(null);
  }

  protected hasError(field: string): boolean {
    return !!this.validationErrors()[field];
  }

  protected getError(field: string): string {
    return this.validationErrors()[field] || '';
  }
}