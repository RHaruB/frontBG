import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  contrasena: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    // If already logged in, redirect to dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (!this.username.trim() || !this.contrasena.trim()) {
      this.errorMessage = 'Por favor ingrese su usuario y contraseña.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.username, this.contrasena).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.codigo === 200) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.mensaje || 'Credenciales incorrectas';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.mensaje || 'Error de conexión con el servidor. Intente más tarde.';
      }
    });
  }
}
