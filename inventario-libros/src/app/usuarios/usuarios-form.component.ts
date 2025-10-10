import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuariosService } from '../services/usuarios.service';
import { Usuario } from '../models/usuario';

@Component({
  selector: 'app-usuarios-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="container mt-4">
    <h2>{{ isEdit ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>

    <form [formGroup]="form" (ngSubmit)="guardar()">
      <div class="mb-3">
        <label class="form-label">Nombre de Usuario:</label>
        <input formControlName="nombreUsuario" class="form-control" required>
      </div>

      <div class="mb-3" *ngIf="!isEdit">
        <label class="form-label">Contraseña:</label>
        <input formControlName="contrasenaUsuario" type="password" class="form-control" required>
      </div>

      <div class="mb-3">
        <label class="form-label">Rol:</label>
        <select formControlName="idRol" class="form-control" required>
          <option [ngValue]="1">Bibliotecario</option>
          <option [ngValue]="2">Lector</option>
        </select>
      </div>

      <button type="submit" class="btn btn-success me-2" [disabled]="form.invalid">
        {{ isEdit ? 'Actualizar' : 'Guardar' }}
      </button>
      <button type="button" class="btn btn-secondary" (click)="cancelar()">Cancelar</button>
    </form>
  </div>
  `
})

export class UsuariosFormComponent implements OnInit {
  form: any;
  isEdit = false;
  idUsuario!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private svc: UsuariosService
  ) {

    this.form = this.fb.group({
      nombreUsuario: ['', Validators.required],
      contrasenaUsuario: [''],
      idRol: [2, Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.idUsuario = +id;
      this.svc.getById(this.idUsuario).subscribe({
        next: (u) => this.form.patchValue(u),
        error: () => Swal.fire('Error', 'No se pudo cargar el usuario', 'error')
      });
    }
  }

  guardar(): void {
    const usuario: Usuario = this.form.getRawValue() as Usuario;

    const request = this.isEdit
      ? this.svc.update(this.idUsuario, usuario)
      : this.svc.create(usuario);

    request.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.isEdit ? 'Usuario actualizado' : 'Usuario creado',
          timer: 1500,
          showConfirmButton: false
        });
        this.router.navigateByUrl('/usuarios');
      },
      error: () => Swal.fire('Error', 'No se pudo guardar el usuario', 'error')
    });
  }

  cancelar(): void {
    this.router.navigateByUrl('/usuarios');
  }
}
