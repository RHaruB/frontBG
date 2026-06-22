import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaApi, ClienteRequest, ClienteResponse } from '../interfaces/api-models.interface';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = `${environment.apiUrl}/Cliente`;

  constructor(private http: HttpClient) {}

  getAll(
    filtro?: string,
    numeroPagina: number = 1,
    tamanoPagina: number = 10,
    soloActivos: boolean = true
  ): Observable<RespuestaApi<ClienteResponse[]>> {
    let params = new HttpParams()
      .set('numeroPagina', numeroPagina.toString())
      .set('tamanoPagina', tamanoPagina.toString())
      .set('soloActivos', soloActivos.toString());

    if (filtro) {
      params = params.set('filtro', filtro);
    }

    return this.http.get<RespuestaApi<ClienteResponse[]>>(this.apiUrl, { params });
  }

  create(cliente: ClienteRequest): Observable<RespuestaApi<{ id: number }>> {
    return this.http.post<RespuestaApi<{ id: number }>>(this.apiUrl, cliente);
  }

  edit(cliente: ClienteRequest): Observable<RespuestaApi<{ id: number }>> {
    return this.http.put<RespuestaApi<{ id: number }>>(this.apiUrl, cliente);
  }

  delete(id: number): Observable<RespuestaApi<{ id: number }>> {
    return this.http.delete<RespuestaApi<{ id: number }>>(`${this.apiUrl}/${id}`);
  }
}
