import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { TaskItemComponent } from '../task-item/task-item';
import { PageResponse } from '../../models/task';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css'],
})
export class TaskListComponent implements OnInit {
  protected tasks = signal<Task[]>([]);
  protected loading = signal(false);
  protected error = signal<string | null>(null);

  protected currentPage = signal(0);
  protected totalPages = signal(0);
  protected totalElements = signal(0);

  protected sortBy = signal('updatedTime');
  protected sortDir = signal('desc');

  protected searchTerm = signal('');

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading.set(true);
    const sort = `${this.sortBy()},${this.sortDir()}`;

    this.taskService
      .getAllTasks(this.currentPage(), 10, sort, this.searchTerm())
      .subscribe({
        next: (response: PageResponse<Task>) => {
          this.tasks.set(response.content);
          this.totalPages.set(response.totalPages);
          this.totalElements.set(response.totalElements);
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

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadTasks();
    }
  }

  prevPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadTasks();
    }
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value.split(',');
    this.sortBy.set(value[0]);
    this.sortDir.set(value[1]);
    this.loadTasks();
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.currentPage.set(0); 
    this.loadTasks();
  }
}
