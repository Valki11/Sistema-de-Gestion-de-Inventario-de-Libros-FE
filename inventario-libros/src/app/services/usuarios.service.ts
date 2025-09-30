import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UsuarioCreateDto, UsuarioDto, UsuarioUpdateDto } from '../models/usuario';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/usuarios`;

  getAll() { return this.http.get<UsuarioDto[]>(this.base); }
  getById(id: number) { return this.http.get<UsuarioDto>(`${this.base}/${id}`); }
  create(dto: UsuarioCreateDto) { return this.http.post<{id:number}>(this.base, dto); }
  update(id: number, dto: UsuarioUpdateDto) { return this.http.put<void>(`${this.base}/${id}`, dto); }
  delete(id: number) { return this.http.delete<void>(`${this.base}/${id}`); }
}
