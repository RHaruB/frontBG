import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class HttpService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    private getHeaders(): HttpHeaders {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        const token = localStorage.getItem('auth_token');
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    }

    private buildUrl(endpoint: string): string {
        return `${this.baseUrl}${endpoint}`;
    }

    get<T>(endpoint: string, params?: any): Observable<T> {
        let httpParams = new HttpParams();

        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    httpParams = httpParams.set(key, params[key].toString());
                }
            });
        }

        return this.http.get<T>(this.buildUrl(endpoint), {
            headers: this.getHeaders(),
            params: httpParams
        });
    }

    post<T>(endpoint: string, body: any, params?: any): Observable<T> {
        let httpParams = new HttpParams();

        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    httpParams = httpParams.set(key, params[key].toString());
                }
            });
        }

        return this.http.post<T>(this.buildUrl(endpoint), body, {
            headers: this.getHeaders(),
            params: httpParams
        });
    }

    put<T>(endpoint: string, body: any): Observable<T> {
        return this.http.put<T>(this.buildUrl(endpoint), body, {
            headers: this.getHeaders()
        });
    }

    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(this.buildUrl(endpoint), {
            headers: this.getHeaders()
        });
    }
}
