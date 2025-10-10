import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AutoresService } from '../services/autores.service';
import { Autor } from '../models/autor'
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-autores-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2 class="mb-3">Autores</h2>

      <!-- Solo bibliotecario puede crear -->
      <button *ngIf="auth.isBibliotecario()" class="btn btn-primary mb-3" (click)="nuevoAutor()">
        ➕ Nuevo Autor
      </button>

      <table class="table table-striped table-hover" *ngIf="autores.length; else sinDatos">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Autor</th>
            <th *ngIf="auth.isBibliotecario()">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let autor of autores">
            <td>{{ autor.idAutor }}</td>
            <td>{{ autor.nombreAutor }}</td>

            <!-- Solo bibliotecario puede editar/eliminar -->
            <td *ngIf="auth.isBibliotecario()">
              <button class="btn btn-sm btn-warning me-2" (click)="editarAutor(autor.idAutor!)">✏️ Editar</button>
              <button class="btn btn-sm btn-danger" (click)="eliminarAutor(autor.idAutor!)">🗑️ Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <ng-template #sinDatos>
        <p class="text-muted">No hay autores registrados.</p>
      </ng-template>
    </div>
  `,
})
export class AutoresListComponent implements OnInit {
  private svc = inject(AutoresService);
  private router = inject(Router);
  auth = inject(AuthService); 
  autores: Autor[] = [];

  ngOnInit() {
    this.cargarAutores();
  }

  cargarAutores() {
    this.svc.getAll().subscribe({
      next: (data) => (this.autores = data),
      error: () => Swal.fire('Error', 'No se pudieron cargar los autores', 'error'),
    });
  }

  nuevoAutor() {
    this.router.navigate(['/autores/nuevo']);
  }

  editarAutor(id: number) {
    this.router.navigate(['/autores', id]);
  }

  eliminarAutor(id: number) {
    Swal.fire({
      title: '¿Eliminar autor?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.svc.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El autor fue eliminado correctamente', 'success');
            this.cargarAutores();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el autor', 'error'),
        });
      }
    });
  }
}
