import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AutoresService } from '../services/autores.service';
import { AutorDto } from '../models/autor';

@Component({
  standalone: true,
  selector: 'app-autores-list',
  imports: [CommonModule, RouterLink],
  template: `
  <div class="toolbar">
    <a routerLink="/autores/nuevo">+ Nuevo autor</a>
  </div>
  <table *ngIf="autores?.length; else empty">
    <thead><tr><th>ID</th><th>Nombre</th><th></th></tr></thead>
    <tbody>
      <tr *ngFor="let a of autores">
        <td>{{a.idAutor}}</td>
        <td>{{a.nombreAutor}}</td>
        <td class="actions">
          <a [routerLink]="['/autores', a.idAutor]">Editar</a>
          <button (click)="del(a.idAutor)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
  <ng-template #empty><p>No hay autores.</p></ng-template>
  `
})
export class AutoresListComponent implements OnInit {
  private svc = inject(AutoresService);
  autores: AutorDto[] = [];
  ngOnInit(){ this.load(); }
  load(){ this.svc.getAll().subscribe(r => this.autores = r); }
  del(id:number){ if(confirm('¿Eliminar autor?')) this.svc.delete(id).subscribe(()=>this.load()); }
}
