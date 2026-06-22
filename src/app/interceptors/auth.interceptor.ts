import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // Exclude login endpoint from adding headers if not needed (optional, but harmless to try adding if token exists)
  const token = localStorage.getItem('bg_auth_token');

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          // Token expired or invalid, clear session and redirect to login
          localStorage.removeItem('bg_auth_token');
          localStorage.removeItem('bg_user_data');
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};
