import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LibroCreateDto, LibroDto, LibroUpdateDto } from '../models/libro';

@Injectable({ providedIn: 'root' })
export class LibrosService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/libros`;

  getAll(q?: string) {
    const params = q ? new HttpParams().set('q', q) : undefined;
    return this.http.get<LibroDto[]>(this.base, { params });
  }
  getById(id: number) { return this.http.get<LibroDto>(`${this.base}/${id}`); }
  create(dto: LibroCreateDto) { return this.http.post<{id:number}>(this.base, dto); }
  update(id: number, dto: LibroUpdateDto) { return this.http.put<void>(`${this.base}/${id}`, dto); }
  delete(id: number) { return this.http.delete<void>(`${this.base}/${id}`); }
}
