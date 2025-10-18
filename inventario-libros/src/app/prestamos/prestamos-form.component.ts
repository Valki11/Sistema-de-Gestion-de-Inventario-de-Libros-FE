import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { PrestamosService } from '../services/prestamos.service';
import { LibrosService } from '../services/libros.service';
import { UsuariosService } from '../services/usuarios.service';
import { LibroDto } from '../models/libro';
import { UsuarioDto } from '../models/usuario';

@Component({
  selector: 'app-prestamos-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  template: `
    <div class="container mt-4">
      <h2 class="mb-3">Registrar Préstamo</h2>

      <form [formGroup]="form" (ngSubmit)="guardarPrestamo()">
        <div class="mb-3">
          <label for="libro" class="form-label">Libro</label>
          <select id="libro" class="form-select" formControlName="idLibro" required>
            <option value="">Seleccione un libro</option>
            <option *ngFor="let libro of librosDisponibles" [value]="libro.idLibro">
              {{ libro.tituloLibro }} ({{ libro.estadoLibro }})
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label for="usuario" class="form-label">Usuario lector</label>
          <select id="usuario" class="form-select" formControlName="idUsuario" required>
            <option value="">Seleccione un lector</option>
            <option *ngFor="let lector of lectores" [value]="lector.idUsuario">
              {{ lector.nombreUsuario }}
            </option>
          </select>
        </div>

        <div class="text-end">
          <button type="submit" class="btn btn-success" [disabled]="form.invalid">
            Guardar préstamo
          </button>
        </div>
      </form>
    </div>
  `,
})
export class PrestamosFormComponent implements OnInit {
  form: FormGroup;
  librosDisponibles: LibroDto[] = [];
  lectores: UsuarioDto[] = [];

  constructor(
    private fb: FormBuilder,
    private prestamosService: PrestamosService,
    private librosService: LibrosService,
    private usuariosService: UsuariosService,
    private router: Router
  ) {
    this.form = this.fb.group({
      idLibro: ['', Validators.required],
      idUsuario: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarLibrosDisponibles();
    this.cargarLectores();
  }

  private cargarLibrosDisponibles(): void {
    this.librosService.getAll().subscribe({
      next: (libros: any[]) => {
        this.librosDisponibles = (libros ?? [])
          .filter(l => !!l.idLibro)
          .map(l => ({
            idLibro: l.idLibro ?? 0,
            tituloLibro: l.tituloLibro ?? '',
            autor: l.autor ?? '',
            anioDePublicacion: l.anioDePublicacion ?? null,
            generoLibro: l.generoLibro ?? '',
            numeroCopias: l.numeroCopias ?? 0,
            estadoLibro: l.estadoLibro ?? '',
          }));
      },
      error: () =>
        Swal.fire('Error', 'No se pudieron cargar los libros disponibles', 'error'),
    });
  }

  private cargarLectores(): void {
  this.usuariosService.getAll().subscribe({
    next: (usuarios: any[]) => {
      this.lectores = (usuarios ?? [])
        .filter(u => u.nombreRol?.toUpperCase() === 'LECTOR') 
        .map(u => ({
          idUsuario: u.idUsuario ?? 0,
          nombreUsuario: u.nombreUsuario ?? '',
          contrasenaUsuario: u.contrasenaUsuario ?? '',
          idRol: u.idRol ?? 0,
          rol: u.rol ?? '',
          nombreRol: u.nombreRol ?? '', 
        }));
    },
    error: () =>
      Swal.fire('Error', 'No se pudieron cargar los usuarios lectores', 'error'),
  });
}


  guardarPrestamo(): void {
  if (this.form.invalid) {
    Swal.fire('Advertencia', 'Debe completar todos los campos.', 'warning');
    return;
  }

  const { idLibro, idUsuario } = this.form.value;

  this.prestamosService.crear(idLibro, idUsuario).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Préstamo registrado correctamente',
        timer: 1500,
        showConfirmButton: false,
      });
      this.router.navigateByUrl('/prestamos');
    },
    error: (err: any) => {
      Swal.fire(
        'Error',
        err.error?.message ?? 'Error al registrar el préstamo',
        'error'
      );
    },
  });
}

}
