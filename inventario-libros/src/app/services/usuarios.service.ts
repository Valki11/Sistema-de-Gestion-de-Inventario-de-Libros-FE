import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private apiUrl = `${environment.apiUrl}/Usuarios`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  create(usuario: Usuario): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }

  update(id: number, usuario: Usuario): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, usuario);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
