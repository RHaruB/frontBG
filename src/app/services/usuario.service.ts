import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaApi, UsuarioRequest, UsuarioUpdateRequest, UsuarioResponse } from '../interfaces/api-models.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/Usuario`;

  constructor(private http: HttpClient) {}

  getAll(
    filtro?: string,
    numeroPagina: number = 1,
    tamanoPagina: number = 10,
    soloActivos: boolean = true
  ): Observable<RespuestaApi<UsuarioResponse[]>> {
    let params = new HttpParams()
      .set('numeroPagina', numeroPagina.toString())
      .set('tamanoPagina', tamanoPagina.toString())
      .set('soloActivos', soloActivos.toString());

    if (filtro) {
      params = params.set('filtro', filtro);
    }

    return this.http.get<RespuestaApi<UsuarioResponse[]>>(this.apiUrl, { params });
  }

  create(usuario: UsuarioRequest): Observable<RespuestaApi<{ id: number }>> {
    return this.http.post<RespuestaApi<{ id: number }>>(this.apiUrl, usuario);
  }

  edit(usuario: UsuarioUpdateRequest): Observable<RespuestaApi<{ id: number }>> {
    return this.http.put<RespuestaApi<{ id: number }>>(this.apiUrl, usuario);
  }

  delete(id: number): Observable<RespuestaApi<{ id: number }>> {
    return this.http.delete<RespuestaApi<{ id: number }>>(`${this.apiUrl}/${id}`);
  }
}
