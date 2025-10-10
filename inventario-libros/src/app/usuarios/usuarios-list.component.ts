import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuariosService } from '../services/usuarios.service';
import { Usuario } from '../models/usuario';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="container mt-4">
    <h2>Usuarios</h2>

    <button *ngIf="auth.isBibliotecario()" routerLink="/usuarios/nuevo" class="btn btn-primary mb-3">
      ➕ Nuevo Usuario
    </button>

    <table class="table table-striped" *ngIf="usuarios.length > 0; else noData">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre Usuario</th>
          <th>Rol</th>
          <th *ngIf="auth.isBibliotecario()">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let u of usuarios">
          <td>{{ u.idUsuario }}</td>
          <td>{{ u.nombreUsuario }}</td>
          <td>{{ u.rolNombre || ('Rol #' + u.idRol) }}</td>
          <td *ngIf="auth.isBibliotecario()">
            <button (click)="editar(u.idUsuario!)" class="btn btn-warning btn-sm me-2">✏️ Editar</button>
            <button (click)="eliminar(u.idUsuario!)" class="btn btn-danger btn-sm">🗑️ Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ng-template #noData>
      <div class="alert alert-info">No hay usuarios registrados</div>
    </ng-template>
  </div>
  `
})
export class UsuariosListComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(
  private svc: UsuariosService,
  public auth: AuthService
) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.svc.getAll().subscribe({
      next: (data) => this.usuarios = data,
      error: () => Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error')
    });
  }

  editar(id: number): void {
    window.location.href = `/usuarios/${id}`;
  }

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.svc.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success');
            this.cargar();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el usuario', 'error')
        });
      }
    });
  }
}
