import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
  <nav class="nav">
    <a routerLink="/libros">Libros</a>
    <a routerLink="/usuarios">Usuarios</a>
    <a routerLink="/autores">Autores</a>
  </nav>
  <div class="container">
    <router-outlet></router-outlet>
  </div>
  `,
  styles: [`
    .nav { display:flex; gap:1rem; padding:1rem; background:#111; }
    .nav a { color:#fff; text-decoration:none; }
    .container { padding:1rem; max-width:900px; margin:0 auto; }
    table { width:100%; border-collapse: collapse; }
    th, td { border-bottom: 1px solid #ddd; padding: .5rem; text-align:left; }
    .actions { display:flex; gap:.5rem; }
    form { display:grid; gap:.75rem; max-width:500px; }
    input, select { padding:.5rem; }
    .toolbar { display:flex; gap:.5rem; margin-bottom:1rem; align-items:center; }
  `]
})
export class AppComponent {}
