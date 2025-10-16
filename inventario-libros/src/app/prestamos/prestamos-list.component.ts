// src/app/prestamos/prestamos-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { PrestamosService } from '../services/prestamos.service';
import { LibrosService } from '../services/libros.service';
import { LibroDto } from '../models/libro';
import { UsuariosService } from '../services/usuarios.service';
import { UsuarioDto } from '../models/usuario';
import { AuthService } from '../auth/auth.service';

type PrestamoItem = {
  idPrestamo: number;
  idLibro: number;
  idUsuario: number;
  tituloLibro: string;
  nombreUsuario: string;
  fechaPrestamo: string;
  fechaDevolucion?: string | null;
  estado: 'PRESTADO' | 'DEVUELTO';
};

@Component({
  standalone: true,
  selector: 'app-prestamos-list',
  imports: [CommonModule],
  template: `
  <div class="header">
    <h2>Préstamos</h2>
    <button *ngIf="auth.isBibliotecario()" class="btn btn-primary" routerLink="/prestamos/nuevo">Nuevo préstamo</button>
  </div>

  <table class="table">
    <thead>
      <tr>
        <th>#</th>
        <th>Libro</th>
        <th>Lector</th>
        <th>Fecha préstamo</th>
        <th>Estado</th>
        <th *ngIf="auth.isBibliotecario()">Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let p of prestamos; index as i">
        <td>{{ i + 1 }}</td>
        <td>{{ p.tituloLibro }}</td>
        <td>{{ p.nombreUsuario }}</td>
        <td>{{ p.fechaPrestamo | date:'short' }}</td>
        <td>{{ p.estado }}</td>
        <td *ngIf="auth.isBibliotecario()">
          <button class="btn"
            [disabled]="p.estado==='DEVUELTO'"
            (click)="devolver(p.idPrestamo)">Devolver</button>
        </td>
      </tr>
      <tr *ngIf="prestamos.length === 0">
        <td colspan="6" class="empty">No hay préstamos</td>
      </tr>
    </tbody>
  </table>
  `,
  styles: [`
    .header{display:flex;justify-content:space-between;align-items:center;margin:16px 0}
    .btn{padding:6px 10px;border-radius:6px;border:1px solid #ddd;background:#f7f7f7;cursor:pointer}
    .btn-primary{background:#1976d2;color:white;border-color:#1976d2}
    .table{width:100%;border-collapse:collapse}
    th,td{padding:10px;border-bottom:1px solid #eee;text-align:left}
    .empty{text-align:center;color:#777}
  `]
})
export class PrestamosListComponent implements OnInit {
  private prestamosSvc = inject(PrestamosService);
  private librosSvc = inject(LibrosService);
  private usuariosSvc = inject(UsuariosService);
  auth = inject(AuthService);
  private router = inject(Router);

  prestamos: PrestamoItem[] = [];

  ngOnInit(): void {

    this.prestamos = []; 
  }

  devolver(idPrestamo: number) {
    Swal.fire({
      title: '¿Devolver libro?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, devolver',
      cancelButtonText: 'Cancelar'
    }).then(res => {
      if (!res.isConfirmed) return;
      this.prestamosSvc.devolver(idPrestamo).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Libro devuelto', timer: 1200, showConfirmButton: false });
          this.ngOnInit();
        },
        error: (err) => {
          const msg = err?.error?.message ?? 'No se pudo devolver';
          Swal.fire('Error', msg, 'error');
        }
      });
    });
  }
}
