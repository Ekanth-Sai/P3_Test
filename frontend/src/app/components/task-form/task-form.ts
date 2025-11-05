import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-form.html',
  styleUrls: ['./task-form.css'],
})
export class TaskFormComponent {
  @Output() taskCreated = new EventEmitter<any>();
  task = { name: '', description: '', notes: '' };

  constructor(private taskService: TaskService) {}

  addTask() {
    this.taskService.createTask(this.task).subscribe((res) => {
      this.taskCreated.emit(res);
      this.task = { name: '', description: '', notes: '' };
    });
  }
}
