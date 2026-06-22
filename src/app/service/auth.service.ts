import { inject, Injectable } from '@angular/core';
import { ApiResponse, LoginResponse, Usuario } from '../interfaces';
// import { API_ENDPOINTS, APP_CONSTANTS } from '@core/constants';
import { Observable, tap } from 'rxjs';
import { HttpService } from './http.service';
import { API_ENDPOINTS, APP_CONSTANTS } from '../constants/app.constants';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpService);

  constructor() { }

  login(userName: string, contrasena: string): Observable<ApiResponse<LoginResponse>> {
        // Pasamos directamente el objeto con los parámetros, sin el envoltorio { params: ... }
        return this.http.post<ApiResponse<LoginResponse>>(API_ENDPOINTS.AUTH.LOGIN, null, {
            userName,
            contrasena
        }).pipe(
            tap(response => {
                if (response.datos?.token) {
                    this.guardarToken(response.datos.token);

                    // Si el API retorna el objeto usuario lo usamos, si no creamos uno con el nombre retornado
                    const usuarioData = response.datos.usuario || {
                        nombre: response.datos.nombre,
                        username: userName
                    } as Usuario;

                    this.guardarUsuario(usuarioData);
                }
            })
        );
    }

    logout(): void {
        localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.USER);
    }

    obtenerToken(): string | null {
        return localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
    }

    estaAutenticado(): boolean {
        return this.obtenerToken() !== null;
    }

    private guardarToken(token: string): void {
        localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN, token);
    }

    private guardarUsuario(usuario: Usuario): void {
        localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.USER, JSON.stringify(usuario));
    }

    obtenerUsuario(): Usuario | null {
        const usuarioJson = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.USER);
        if (usuarioJson) {
            try {
                return JSON.parse(usuarioJson) as Usuario;
            } catch (e) {
                console.error('Error parseando usuario del localStorage', e);
                return null;
            }
        }
        return null;
    }
}
