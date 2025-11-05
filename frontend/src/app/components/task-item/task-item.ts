// frontend/src/app/components/task-item/task-item.ts
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

  protected isEditing = signal(false);
  protected isExpanded = signal(false);
  protected editForm = signal<TaskUpdateRequest>({});
  protected loading = signal(false);
  protected error = signal<string | null>(null);

  protected readonly TaskStatus = TaskStatus;
  protected readonly TaskStatusLabels = TaskStatusLabels;

  constructor(private taskService: TaskService) {}

  // add methods to change status, save updates, delete task, etc.
  // (You can re-use logic from your .spec.ts version if you want full behavior)
}
