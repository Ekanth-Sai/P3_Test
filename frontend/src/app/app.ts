import { Component } from '@angular/core';
import { TaskListComponent } from './components/task-list/task-list';
import { TaskFormComponent } from './components/task-form/task-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskListComponent, TaskFormComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  onTaskCreated(task: any) {
    console.log('New task created:', task);
  }
}
