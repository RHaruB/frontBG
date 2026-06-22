import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaApi, FormaPagoResponse } from '../interfaces/api-models.interface';

@Injectable({
  providedIn: 'root'
})
export class FormaPagoService {
  private apiUrl = `${environment.apiUrl}/FormaPago`;

  constructor(private http: HttpClient) {}

  getActive(): Observable<RespuestaApi<FormaPagoResponse[]>> {
    return this.http.get<RespuestaApi<FormaPagoResponse[]>>(this.apiUrl);
  }
}
