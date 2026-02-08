import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { User, UserRole } from '../../../../features/users/models/users.model';

@Component({
  selector: 'user-card',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
  user = input.required<User>();
  canEdit = input<boolean>(false);
  UserRole = UserRole;

  onEdit = output<User>();
}
