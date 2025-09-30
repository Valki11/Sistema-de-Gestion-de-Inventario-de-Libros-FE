import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LibrosService } from '../services/libros.service';
import { LibroDto } from '../models/libro';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-libros-list',
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
  <div class="toolbar">
    <input [(ngModel)]="q" placeholder="Buscar por título/autor"/>
    <button (click)="load()">Buscar</button>
    <a routerLink="/libros/nuevo">+ Nuevo libro</a>
  </div>

  <table *ngIf="libros?.length; else empty">
    <thead>
      <tr>
        <th>ID</th><th>Título</th><th>Autor</th><th>Año</th><th>Copias</th><th>Estado</th><th></th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let l of libros">
        <td>{{l.idLibro}}</td>
        <td>{{l.tituloLibro}}</td>
        <td>{{l.autor}}</td>
        <td>{{l.anioDePublicacion ?? '-'}}</td>
        <td>{{l.numeroCopias ?? 0}}</td>
        <td>{{l.estadoLibro || '-'}}</td>
        <td class="actions">
          <a [routerLink]="['/libros', l.idLibro]">Editar</a>
          <button (click)="del(l.idLibro)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>

  <ng-template #empty>
    <p>No hay libros.</p>
  </ng-template>
  `
})
export class LibrosListComponent implements OnInit {
  private svc = inject(LibrosService);
  libros: LibroDto[] = [];
  q = '';

  ngOnInit() { this.load(); }
  load() { this.svc.getAll(this.q).subscribe(r => this.libros = r); }
  del(id: number) {
    if (!confirm('¿Eliminar libro?')) return;
    this.svc.delete(id).subscribe(() => this.load());
  }
}
