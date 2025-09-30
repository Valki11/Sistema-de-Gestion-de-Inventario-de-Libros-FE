import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
  <nav class="nav" *ngIf="auth.isLoggedInSync()">
    <a routerLink="/libros">Libros</a>
    <a routerLink="/usuarios">Usuarios</a>
    <a routerLink="/autores">Autores</a>
    <span class="spacer"></span>
    <button (click)="logout()">Salir</button>
  </nav>
  <div class="container">
    <router-outlet></router-outlet>
  </div>
  `,
  styles: [`
    .nav{display:flex;gap:1rem;align-items:center;padding:.75rem;background:#111}
    .nav a{color:#fff;text-decoration:none}
    .spacer{flex:1}
    .container{max-width:1000px;margin:0 auto;padding:1rem}
  `]
})
export class App {
  auth = inject(AuthService);

  logout(){
    this.auth.logout();

    location.href = '/login'; // evita estado SSR desincronizado
  }
}
