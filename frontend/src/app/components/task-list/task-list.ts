// frontend/src/app/components/task-list/task-list.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { TaskItemComponent } from '../task-item/task-item';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css']
})
export class TaskListComponent {
  protected tasks = signal<Task[]>([]);
  protected loading = signal(false);
  protected error = signal<string | null>(null);

  constructor(private taskService: TaskService) {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading.set(true);
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        // ✅ FIX: Extract array from PageResponse
        this.tasks.set(data.content || []); 
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load tasks.');
        this.loading.set(false);
      },
    });
  }

  onTaskUpdated(): void {
    this.loadTasks();
  }

  onTaskDeleted(): void {
    this.loadTasks();
  }
}
