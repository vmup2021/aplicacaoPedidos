import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ROLE_LABEL } from '../../core/models/enums';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  readonly ROLE_LABEL = ROLE_LABEL;

  readonly initials = computed(() => {
    const name = this.auth.currentUser()?.nome ?? '';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  });

  constructor(readonly auth: AuthService) {}

  logout(): void {
    this.auth.logout();
  }
}
