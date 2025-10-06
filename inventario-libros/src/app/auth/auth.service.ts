import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface LoginRequest {
  nombreUsuario: string;
  contrasenaUsuario: string;
}

interface LoginResponse {
  idUsuario: number;
  nombreUsuario: string;
  rol: string; // "Bibliotecario" o "Lector"
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5188/api/Auth/login';

  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(this.getUser());
  currentUser$ = this.currentUserSubject.asObservable();

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, credentials).pipe(
      tap((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getUser(): LoginResponse | null {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getUser();
  }

  getRole(): string | null {
    return this.getUser()?.rol ?? null;
  }

  isBibliotecario(): boolean {
    return this.getRole() === 'Bibliotecario';
  }

  isLector(): boolean {
    return this.getRole() === 'Lector';
  }
}
