import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css'],
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe((res) => (this.tasks = res.content || []));
  }

  updateStatus(task: any) {
    const nextStatusMap: any = {
      PENDING: 'TODO',
      TODO: 'IN_PROGRESS',
      IN_PROGRESS: 'COMPLETED',
    };

    const newStatus = nextStatusMap[task.status] || 'COMPLETED';
    this.taskService.updateStatus(task.id, newStatus).subscribe(() => this.loadTasks());
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(() => this.loadTasks());
  }
}
