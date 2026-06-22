import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaApi, FacturaRequest, FacturaResponse, FacturaFiltroRequest } from '../interfaces/api-models.interface';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private apiUrl = `${environment.apiUrl}/Factura`;

  constructor(private http: HttpClient) {}

  list(filtros: FacturaFiltroRequest): Observable<RespuestaApi<FacturaResponse[]>> {
    let params = new HttpParams()
      .set('pagina', filtros.pagina.toString())
      .set('registrosPorPagina', filtros.registrosPorPagina.toString());

    if (filtros.numeroFactura) {
      params = params.set('numeroFactura', filtros.numeroFactura);
    }
    if (filtros.clienteID) {
      params = params.set('clienteID', filtros.clienteID.toString());
    }
    if (filtros.vendedorID) {
      params = params.set('vendedorID', filtros.vendedorID.toString());
    }
    if (filtros.fechaDesde) {
      params = params.set('fechaDesde', filtros.fechaDesde);
    }
    if (filtros.fechaHasta) {
      params = params.set('fechaHasta', filtros.fechaHasta);
    }
    if (filtros.montoDesde !== undefined && filtros.montoDesde !== null) {
      params = params.set('montoDesde', filtros.montoDesde.toString());
    }
    if (filtros.montoHasta !== undefined && filtros.montoHasta !== null) {
      params = params.set('montoHasta', filtros.montoHasta.toString());
    }

    return this.http.get<RespuestaApi<FacturaResponse[]>>(this.apiUrl, { params });
  }

  create(factura: FacturaRequest): Observable<RespuestaApi<{ id: number }>> {
    return this.http.post<RespuestaApi<{ id: number }>>(this.apiUrl, factura);
  }

  getById(id: number): Observable<RespuestaApi<FacturaResponse>> {
    return this.http.get<RespuestaApi<FacturaResponse>>(`${this.apiUrl}/${id}`);
  }
}
