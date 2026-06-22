import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaApi, ProductoRequest, ProductoResponse } from '../interfaces/api-models.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = `${environment.apiUrl}/Producto`;

  constructor(private http: HttpClient) {}

  getAll(
    filtro?: string,
    numeroPagina: number = 1,
    tamanoPagina: number = 10,
    soloActivos: boolean = true
  ): Observable<RespuestaApi<ProductoResponse[]>> {
    let params = new HttpParams()
      .set('numeroPagina', numeroPagina.toString())
      .set('tamanoPagina', tamanoPagina.toString())
      .set('soloActivos', soloActivos.toString());

    if (filtro) {
      params = params.set('filtro', filtro);
    }

    return this.http.get<RespuestaApi<ProductoResponse[]>>(this.apiUrl, { params });
  }

  create(producto: ProductoRequest): Observable<RespuestaApi<{ id: number }>> {
    return this.http.post<RespuestaApi<{ id: number }>>(this.apiUrl, producto);
  }

  edit(producto: ProductoRequest): Observable<RespuestaApi<{ id: number }>> {
    return this.http.put<RespuestaApi<{ id: number }>>(this.apiUrl, producto);
  }

  delete(id: number): Observable<RespuestaApi<{ id: number }>> {
    return this.http.delete<RespuestaApi<{ id: number }>>(`${this.apiUrl}/${id}`);
  }
}
