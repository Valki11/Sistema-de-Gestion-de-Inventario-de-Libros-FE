import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LibrosService } from '../services/libros.service';
import { AutoresService } from '../services/autores.service';
import { AutorDto } from '../models/autor';

@Component({
  standalone: true,
  selector: 'app-libros-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
  <h2>{{isEdit ? 'Editar' : 'Nuevo'}} libro</h2>

  <form [formGroup]="form" (ngSubmit)="save()">
    <label>Título
      <input formControlName="tituloLibro" required />
    </label>

    <label>Autor
      <select formControlName="idAutor" required>
        <option [ngValue]="null">-- Selecciona --</option>
        <option *ngFor="let a of autores" [value]="a.idAutor">{{a.nombreAutor}}</option>
      </select>
    </label>

    <label>Año
      <input type="number" formControlName="anioDePublicacion" />
    </label>

    <label>Género
      <input formControlName="generoLibro" />
    </label>

    <label>Copias
      <input type="number" formControlName="numeroCopias" />
    </label>

    <label>Estado
      <input formControlName="estadoLibro" placeholder="DISPONIBLE / PRESTADO / etc." />
    </label>

    <div class="actions">
      <button type="submit" [disabled]="form.invalid">Guardar</button>
      <a routerLink="/libros">Cancelar</a>
    </div>
  </form>
  `
})
export class LibrosFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private svc = inject(LibrosService);
  private autoresSvc = inject(AutoresService);

  autores: AutorDto[] = [];
  isEdit = false;
  id?: number;

  form = this.fb.group({
    tituloLibro: ['', Validators.required],
    idAutor: [null as number | null, Validators.required],
    anioDePublicacion: [null as number | null],
    generoLibro: [''],
    numeroCopias: [null as number | null],
    estadoLibro: ['']
  });

  ngOnInit() {
    this.autoresSvc.getAll().subscribe(a => this.autores = a);
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.id;

    if (this.isEdit) {
      this.svc.getById(this.id!).subscribe(l => {
        this.form.patchValue({
          tituloLibro: l.tituloLibro,
          idAutor: (this.autores.find(a => a.nombreAutor === l.autor)?.idAutor) ?? null,
          anioDePublicacion: l.anioDePublicacion ?? null,
          generoLibro: l.generoLibro ?? '',
          numeroCopias: l.numeroCopias ?? null,
          estadoLibro: l.estadoLibro ?? ''
        });
      });
    }
  }

  save() {
    const value = this.form.getRawValue();
    if (this.isEdit) {
      this.svc.update(this.id!, value).subscribe(() => this.router.navigateByUrl('/libros'));
    } else {
      this.svc.create(value).subscribe(() => this.router.navigateByUrl('/libros'));
    }
  }
}