import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Libro } from '../models/libro';

@Injectable({ providedIn: 'root' })
export class LibrosService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5188/api/Libros';

  getAll(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl);
  }

  getById(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.apiUrl}/${id}`);
  }

  create(libro: Libro): Observable<any> {
    return this.http.post(this.apiUrl, libro);
  }

  update(id: number, libro: Libro): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, libro);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
