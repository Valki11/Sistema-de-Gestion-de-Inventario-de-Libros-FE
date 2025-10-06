import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LibrosService } from '../services/libros.service';
import { Libro } from '../models/libro';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-libros-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2 class="mb-3">Libros</h2>

      <!-- Solo bibliotecario puede crear -->
      <button *ngIf="auth.isBibliotecario()" class="btn btn-primary mb-3" (click)="nuevo()">
        ➕ Nuevo Libro
      </button>

      <table class="table table-striped table-hover" *ngIf="libros.length; else sinDatos">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Año</th>
            <th>Género</th>
            <th>Copias</th>
            <th>Estado</th>
            <th *ngIf="auth.isBibliotecario()">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let l of libros">
            <td>{{ l.idLibro }}</td>
            <td>{{ l.tituloLibro }}</td>
            <td>{{ l.autor || ('Autor #' + l.idAutor) }}</td>
            <td>{{ l.anioDePublicacion }}</td>
            <td>{{ l.generoLibro }}</td>
            <td>{{ l.numeroCopias }}</td>
            <td>{{ l.estadoLibro }}</td>

            <!-- Solo bibliotecario puede editar/eliminar -->
            <td *ngIf="auth.isBibliotecario()">
              <button class="btn btn-sm btn-warning me-2" (click)="editar(l.idLibro!)">✏️ Editar</button>
              <button class="btn btn-sm btn-danger" (click)="eliminar(l.idLibro!)">🗑️ Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <ng-template #sinDatos>
        <p class="text-muted">No hay libros registrados.</p>
      </ng-template>
    </div>
  `,
})
export class LibrosListComponent implements OnInit {
  private svc = inject(LibrosService);
  private router = inject(Router);
  auth = inject(AuthService); // 👈 servicio de autenticación

  libros: Libro[] = [];

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.svc.getAll().subscribe({
      next: (data) => (this.libros = data),
      error: () => Swal.fire('Error', 'No se pudieron cargar los libros', 'error'),
    });
  }

  nuevo() {
    this.router.navigateByUrl('/libros/nuevo');
  }

  editar(id: number) {
    this.router.navigateByUrl(`/libros/${id}`);
  }

  eliminar(id: number) {
    Swal.fire({
      title: '¿Eliminar libro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.svc.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El libro fue eliminado', 'success');
            this.cargar();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar', 'error'),
        });
      }
    });
  }
}
