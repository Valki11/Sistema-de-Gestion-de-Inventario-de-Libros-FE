import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';
import { UsuarioDto } from '../models/usuario';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  selector: 'app-usuarios-list',
  template: `
  <div class="toolbar">
    <a routerLink="/usuarios/nuevo">+ Nuevo usuario</a>
  </div>

  <table *ngIf="usuarios?.length; else empty">
    <thead><tr><th>ID</th><th>Usuario</th><th>Rol</th><th></th></tr></thead>
    <tbody>
      <tr *ngFor="let u of usuarios">
        <td>{{u.idUsuario}}</td>
        <td>{{u.nombreUsuario}}</td>
        <td>{{u.rol}}</td>
        <td class="actions">
          <a [routerLink]="['/usuarios', u.idUsuario]">Editar</a>
          <button (click)="del(u.idUsuario)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
  <ng-template #empty><p>No hay usuarios.</p></ng-template>
  `
})
export class UsuariosListComponent implements OnInit {
  private svc = inject(UsuariosService);
  usuarios: UsuarioDto[] = [];
  ngOnInit(){ this.load(); }
  load(){ this.svc.getAll().subscribe(r => this.usuarios = r); }
  del(id:number){ if(confirm('¿Eliminar usuario?')) this.svc.delete(id).subscribe(()=>this.load()); }
}
