import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaApi, LoginResponse } from '../interfaces/api-models.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Login`;

  // Signals for state management
  currentUserSignal = signal<LoginResponse | null>(null);
  isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor(private http: HttpClient, private router: Router) {
    this.loadSession();
  }

  private loadSession(): void {
    const token = localStorage.getItem('bg_auth_token');
    const userData = localStorage.getItem('bg_user_data');

    if (token && userData) {
      try {
        this.currentUserSignal.set(JSON.parse(userData));
      } catch (e) {
        this.logout();
      }
    }
  }

  login(userName: string, contrasena: string): Observable<RespuestaApi<LoginResponse>> {
    // API expects parameters in query string
    const params = { userName, contrasena };
    return this.http.post<RespuestaApi<LoginResponse>>(this.apiUrl, null, { params }).pipe(
      tap(response => {
        if (response.codigo === 200 && response.datos) {
          const user = response.datos;
          localStorage.setItem('bg_auth_token', user.token);
          localStorage.setItem('bg_user_data', JSON.stringify(user));
          this.currentUserSignal.set(user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('bg_auth_token');
    localStorage.removeItem('bg_user_data');
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  getCurrentToken(): string | null {
    return localStorage.getItem('bg_auth_token');
  }
}
