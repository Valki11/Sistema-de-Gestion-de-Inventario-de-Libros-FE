import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AutorCreateDto, AutorDto, AutorUpdateDto } from '../models/autor';

@Injectable({ providedIn: 'root' })
export class AutoresService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/autores`;

  getAll() { return this.http.get<AutorDto[]>(this.base); }
  getById(id: number) { return this.http.get<AutorDto>(`${this.base}/${id}`); }
  create(dto: AutorCreateDto) { return this.http.post<{id:number}>(this.base, dto); }
  update(id: number, dto: AutorUpdateDto) { return this.http.put<void>(`${this.base}/${id}`, dto); }
  delete(id: number) { return this.http.delete<void>(`${this.base}/${id}`); }
}
