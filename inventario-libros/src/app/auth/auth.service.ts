import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  nombreUsuario: string;
  contrasenaUsuario: string;
}

export interface LoginResponse {
  idUsuario: number;
  nombreUsuario: string;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5188/api/Auth';
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
        if (this.isBrowser()) {
          localStorage.setItem('user', JSON.stringify(res));
        }
      })
    );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('user');
    }
  }

  getUser(): LoginResponse | null {
    if (!this.isBrowser()) return null;
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem('user');
  }

  isBibliotecario(): boolean {
    const user = this.getUser();
    return user?.rol?.toLowerCase() === 'bibliotecario';
  }

  isLector(): boolean {
    const user = this.getUser();
    return user?.rol?.toLowerCase() === 'lector';
  }

  isLoggedInSync(): boolean {
    return this.isAuthenticated();
  }
}
