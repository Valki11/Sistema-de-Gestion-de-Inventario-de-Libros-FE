import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AutoresService } from '../services/autores.service';

@Component({
  selector: 'app-autores-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h2>{{ id ? 'Editar Autor' : 'Nuevo Autor' }}</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label class="form-label">Nombre del Autor</label>
          <input
            type="text"
            formControlName="nombreAutor"
            class="form-control"
            [class.is-invalid]="form.controls.nombreAutor.invalid && form.controls.nombreAutor.touched"
          />
          <div class="invalid-feedback" *ngIf="form.controls.nombreAutor.errors?.['required']">
            El nombre es obligatorio.
          </div>
        </div>

        <button class="btn btn-success" type="submit" [disabled]="form.invalid">
          {{ id ? 'Actualizar' : 'Guardar' }}
        </button>
        <button type="button" class="btn btn-secondary ms-2" (click)="cancelar()">Cancelar</button>
      </form>
    </div>
  `,
})
export class AutoresFormComponent implements OnInit {
  id: number | null = null;
  form: any;

  constructor(
    private fb: FormBuilder,
    private svc: AutoresService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombreAutor: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.svc.getById(this.id).subscribe({
        next: (autor) => this.form.patchValue(autor),
        error: () => Swal.fire('Error', 'No se pudo cargar el autor', 'error'),
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const value = { nombreAutor: this.form.value.nombreAutor?.toUpperCase() };

    if (this.id) {
      this.svc.update(this.id, value).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'El autor fue actualizado correctamente', 'success');
          this.router.navigate(['/autores']);
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar el autor', 'error'),
      });
    } else {
      this.svc.create(value).subscribe({
        next: () => {
          Swal.fire('Creado', 'El autor fue creado correctamente', 'success');
          this.router.navigate(['/autores']);
        },
        error: () => Swal.fire('Error', 'No se pudo crear el autor', 'error'),
      });
    }
  }

  cancelar() {
    this.router.navigate(['/autores']);
  }
}

