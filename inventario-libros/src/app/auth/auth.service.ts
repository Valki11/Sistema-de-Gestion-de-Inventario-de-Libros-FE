import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/auth`;

  private readonly _user$ = new BehaviorSubject<LoginResponse | null>(this.readFromStorage());
  user$ = this._user$.asObservable();

  private readFromStorage(): LoginResponse | null {
    try {
      const raw = localStorage.getItem('auth_user');
      return raw ? JSON.parse(raw) as LoginResponse : null;
    } catch { return null; }
  }

  private writeToStorage(user: LoginResponse | null) {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user));
    else localStorage.removeItem('auth_user');
  }

  isLoggedInSync(): boolean { return this._user$.value !== null; }

  login(payload: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.base}/login`, payload).pipe(
      tap(user => {
        this._user$.next(user);
        this.writeToStorage(user);
      })
    );
  }

  logout() {
    this._user$.next(null);
    this.writeToStorage(null);
  }

  // Helpers
  get currentUser(): LoginResponse | null { return this._user$.value; }
}
