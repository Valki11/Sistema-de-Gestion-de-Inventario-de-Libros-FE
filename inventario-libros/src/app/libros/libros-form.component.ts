import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LibrosService } from '../services/libros.service';
import { AutoresService } from '../services/autores.service';
import { Libro } from '../models/libro';

@Component({
  standalone: true,
  selector: 'app-libros-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="card">
    <h2>{{ isEdit ? 'Editar Libro' : 'Nuevo Libro' }}</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>Título:
        <input formControlName="tituloLibro" />
      </label>

      <label>Autor:
        <select formControlName="idAutor">
          <option value="">-- Seleccione --</option>
          <option *ngFor="let a of autores" [value]="a.idAutor">{{ a.nombreAutor }}</option>
        </select>
      </label>

      <label>Año de Publicación:
        <input type="number" formControlName="anioDePublicacion" />
      </label>

      <label>Género:
        <input formControlName="generoLibro" />
      </label>

      <label>Número de Copias:
        <input type="number" formControlName="numeroCopias" />
      </label>

      <label>Estado:
        <select formControlName="estadoLibro">
          <option value="DISPONIBLE">Disponible</option>
          <option value="NO DISPONIBLE">No disponible</option>
        </select>
      </label>

      <button type="submit" [disabled]="form.invalid">{{ isEdit ? 'Actualizar' : 'Guardar' }}</button>
      <button type="button" (click)="cancelar()">Cancelar</button>
    </form>
  </div>
  `,
  styles: [`
    .card { max-width: 500px; margin: 2rem auto; padding: 1rem; border: 1px solid #ccc; border-radius: 10px; }
    label { display: block; margin-bottom: .75rem; }
    input, select { width: 100%; padding: .4rem; margin-top: .3rem; }
    button { margin-right: .5rem; padding: .5rem 1rem; }
  `]
})
export class LibrosFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private librosService = inject(LibrosService);
  private autoresService = inject(AutoresService);

  autores: any[] = [];
  isEdit = false;
  idLibro!: number;

form = this.fb.group({
  tituloLibro: ['' as string | null, Validators.required],
  idAutor: ['' as string | null, Validators.required],
  anioDePublicacion: [null as number | null, Validators.required],
  generoLibro: ['' as string | null, Validators.required],
  numeroCopias: [1 as number | null, [Validators.required, Validators.min(1)]],
  estadoLibro: ['DISPONIBLE' as string | null, Validators.required]
});


  ngOnInit() {
  this.cargarAutores();

  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.isEdit = true;
    this.idLibro = +id;
    this.librosService.getById(this.idLibro).subscribe((libro) => {
   
      this.form.patchValue({
        tituloLibro: libro.tituloLibro ?? null,
        idAutor: libro.idAutor?.toString() ?? null,
        anioDePublicacion: libro.anioDePublicacion ?? null,
        generoLibro: libro.generoLibro ?? null,
        numeroCopias: libro.numeroCopias ?? null,
        estadoLibro: libro.estadoLibro ?? null
      });
    });
  }
}


  cargarAutores() {
    this.autoresService.getAll().subscribe(a => this.autores = a);
  }

  onSubmit() {
  if (this.form.invalid) return;

  const libro: Libro = {
    ...this.form.value,
    idAutor: Number(this.form.value.idAutor), 
    anioDePublicacion: Number(this.form.value.anioDePublicacion),
    numeroCopias: Number(this.form.value.numeroCopias),
  } as Libro;

  const request = this.isEdit
    ? this.librosService.update(this.idLibro, libro)
    : this.librosService.create(libro);

  request.subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: this.isEdit ? 'Libro actualizado' : 'Libro agregado',
        timer: 1500,
        showConfirmButton: false,
      });
      this.router.navigateByUrl('/libros');
    },
    error: (err) => {
      Swal.fire('Error', err.error?.message ?? 'Error al guardar el libro', 'error');
    },
  });
}
 
  cancelar() {
    this.router.navigateByUrl('/libros');
  }
}
