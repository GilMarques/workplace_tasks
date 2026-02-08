import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  Task,
  TaskStatus,
} from '../../../../features/tasks/models/tasks.model';

@Component({
  selector: 'task-card',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  task = input.required<Task>();
  canEdit = input<boolean>(false);
  TaskStatus = TaskStatus;

  onEdit = output<Task>();
}
