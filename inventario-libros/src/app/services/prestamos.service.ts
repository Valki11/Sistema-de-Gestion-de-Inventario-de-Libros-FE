import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PrestamoDto {
  idPrestamo: number;
  idLibro: number;
  tituloLibro?: string;
  idUsuario: number;
  nombreUsuario?: string;
  fechaPrestamo: string;
  fechaDevolucion?: string | null;
  estado: 'NO DISPONIBLE' | 'DISPONIBLE';
}

@Injectable({ providedIn: 'root' })
export class PrestamosService {
  private baseUrl = 'http://localhost:5188/api/Prestamos';

  constructor(private http: HttpClient) {}

  crear(idLibro: number, idUsuario: number): Observable<{ idPrestamo: number }> {
    const params = new HttpParams()
      .set('idLibro', String(idLibro))
      .set('idUsuario', String(idUsuario));
    return this.http.post<{ idPrestamo: number }>(this.baseUrl, null, { params });
  }

  devolver(idPrestamo: number) {
    return this.http.post(`${this.baseUrl}/${idPrestamo}/devolver`, {});
  }
}
