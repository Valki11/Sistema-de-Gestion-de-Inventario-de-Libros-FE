import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { PrestamosService } from '../services/prestamos.service';
import { LibrosService } from '../services/libros.service';
import { LibroDto } from '../models/libro';
import { UsuariosService } from '../services/usuarios.service';
import { UsuarioDto } from '../models/usuario';
import { AuthService } from '../auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-prestamos-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="card">
    <h2>Nuevo préstamo</h2>

    <form [formGroup]="form" (ngSubmit)="guardar()">
      <div class="form-group">
        <label>Libro</label>
        <select formControlName="idLibro">
          <option value="" disabled>Seleccione un libro</option>
          <option *ngFor="let l of librosDisponibles" [value]="l.idLibro">
            {{ l.tituloLibro }} (Copias: {{ l.numeroCopias }})
          </option>
        </select>
        <div class="error" *ngIf="form.controls.idLibro.invalid && form.controls.idLibro.touched">
          Seleccione un libro.
        </div>
      </div>

      <div class="form-group">
        <label>Lector</label>
        <select formControlName="idUsuario">
          <option value="" disabled>Seleccione un lector</option>
          <option *ngFor="let u of lectores" [value]="u.idUsuario">
            {{ u.nombreUsuario }} ({{ u.nombreRol }})
          </option>
        </select>
        <div class="error" *ngIf="form.controls.idUsuario.invalid && form.controls.idUsuario.touched">
          Seleccione un lector.
        </div>
      </div>

      <div class="actions">
        <button class="btn btn-primary" type="submit" [disabled]="form.invalid">Guardar</button>
        <button class="btn" type="button" (click)="cancelar()">Cancelar</button>
      </div>
    </form>
  </div>
  `,
  styles: [`
    .card{max-width:520px;margin:16px auto;padding:16px;border:1px solid #eee;border-radius:8px}
    .form-group{margin-bottom:12px;display:flex;flex-direction:column}
    .form-group select{padding:8px}
    .actions{display:flex;gap:8px}
    .btn{padding:8px 12px;border-radius:6px;border:1px solid #ddd;background:#f7f7f7;cursor:pointer}
    .btn-primary{background:#1976d2;color:white;border-color:#1976d2}
    .btn:disabled{opacity:.6;cursor:not-allowed}
    .error{color:#c62828;font-size:12px;margin-top:2px}
  `]
})
export class PrestamosFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private prestamos = inject(PrestamosService);
  private librosSvc = inject(LibrosService);
  private usuariosSvc = inject(UsuariosService);
  private router = inject(Router);
  auth = inject(AuthService);

  form = this.fb.group({
    idLibro: [null as number | null, Validators.required],
    idUsuario: [null as number | null, Validators.required],
  });

  librosDisponibles: LibroDto[] = [];
  lectores: UsuarioDto[] = [];

  ngOnInit(): void {
    if (!this.auth.isBibliotecario()) {
      this.router.navigateByUrl('/libros');
      return;
    }

    this.librosSvc.getAll().subscribe({
      next: (libros) => this.librosDisponibles = (libros ?? []).filter(l => (l.numeroCopias ?? 0) > 0),
      error: () => Swal.fire('Error', 'No se pudo cargar libros', 'error')
    });

    this.usuariosSvc.getAll().subscribe({
      next: (usuarios) => this.lectores = (usuarios ?? []).filter(u =>
        (u.nombreRol ?? '').toUpperCase() === 'LECTOR'
      ),
      error: () => Swal.fire('Error', 'No se pudo cargar usuarios', 'error')
    });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { idLibro, idUsuario } = this.form.getRawValue();

    this.prestamos.crear(idLibro!, idUsuario!).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Préstamo registrado', timer: 1200, showConfirmButton: false });
        this.router.navigateByUrl('/prestamos');
      },
      error: (err) => {
        const msg = err?.error?.message ?? err?.error ?? 'Error al registrar préstamo';
        Swal.fire('Error', msg, 'error');
      }
    });
  }

  cancelar() {
    this.router.navigateByUrl('/prestamos');
  }
}
