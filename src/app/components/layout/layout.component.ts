import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  isSidebarCollapsed = false;

  // Retrieve user name from auth signal
  userName = computed(() => this.authService.currentUserSignal()?.nombre || 'Usuario');
  userEmail = computed(() => this.authService.currentUserSignal()?.email || '');
  userInitial = computed(() => {
    const name = this.authService.currentUserSignal()?.nombre || 'U';
    return name.charAt(0).toUpperCase();
  });

  constructor(private authService: AuthService, private router: Router) {}

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }
}
