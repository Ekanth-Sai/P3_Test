import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task, PageResponse } from '../../models/task';
import { TaskStatus, TaskStatusLabels } from '../../models/task-status';
import { TaskItemComponent } from '../task-item/task-item';
import { TaskFormComponent } from '../task-form/task-form';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskItemComponent, TaskFormComponent],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskListComponent implements OnInit {
  protected tasks = signal<Task[]>([]);
  protected loading = signal(false);
  protected error = signal<string | null>(null);
  protected showForm = signal(false);

  // Pagination
  protected currentPage = signal(0);
  protected pageSize = signal(10);
  protected totalElements = signal(0);
  protected totalPages = signal(0);

  // Filters
  protected searchTerm = signal('');
  protected selectedStatus = signal<TaskStatus | undefined>(undefined);
  protected sortBy = signal('updatedTime');
  protected sortDir = signal('DESC');

  protected readonly TaskStatus = TaskStatus;
  protected readonly TaskStatusLabels = TaskStatusLabels;
  protected readonly statusOptions = Object.values(TaskStatus);

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  protected loadTasks(): void {
    this.loading.set(true);
    this.error.set(null);

    this.taskService
      .getAllTasks(
        this.currentPage(),
        this.pageSize(),
        this.searchTerm() || undefined,
        this.selectedStatus(),
        this.sortBy(),
        this.sortDir()
      )
      .subscribe({
        next: (response: PageResponse<Task>) => {
          this.tasks.set(response.content);
          this.totalElements.set(response.totalElements);
          this.totalPages.set(response.totalPages);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load tasks. Please try again.');
          this.loading.set(false);
          console.error('Error loading tasks:', err);
        },
      });
  }

  protected onSearch(): void {
    this.currentPage.set(0);
    this.loadTasks();
  }

  protected onStatusFilter(status: string): void {
    this.selectedStatus.set(status ? (status as TaskStatus) : undefined);
    this.currentPage.set(0);
    this.loadTasks();
  }

  protected onSort(field: string): void {
    if (this.sortBy() === field) {
      this.sortDir.set(this.sortDir() === 'ASC' ? 'DESC' : 'ASC');
    } else {
      this.sortBy.set(field);
      this.sortDir.set('DESC');
    }
    this.loadTasks();
  }

  protected previousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update((p) => p - 1);
      this.loadTasks();
    }
  }

  protected nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update((p) => p + 1);
      this.loadTasks();
    }
  }

  protected onTaskCreated(task: Task): void {
    this.showForm.set(false);
    this.loadTasks();
  }

  protected onTaskUpdated(task: Task): void {
    this.loadTasks();
  }

  protected onTaskDeleted(taskId: number): void {
    this.loadTasks();
  }

  protected toggleForm(): void {
    this.showForm.update((v) => !v);
  }
}
