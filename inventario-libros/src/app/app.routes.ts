import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { bibliotecarioGuard } from './auth/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  { path: 'login', loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent) },

  { path: 'libros', loadComponent: () => import('./libros/libros-list.component').then(m => m.LibrosListComponent), canActivate: [authGuard] },
  { path: 'libros/nuevo', loadComponent: () => import('./libros/libros-form.component').then(m => m.LibrosFormComponent), canActivate: [bibliotecarioGuard] },
  { path: 'libros/:id', loadComponent: () => import('./libros/libros-form.component').then(m => m.LibrosFormComponent), canActivate: [bibliotecarioGuard] },

  { path: 'autores', loadComponent: () => import('./autores/autores-list.component').then(m => m.AutoresListComponent), canActivate: [authGuard] },
  { path: 'autores/nuevo', loadComponent: () => import('./autores/autores-form.component').then(m => m.AutoresFormComponent), canActivate: [bibliotecarioGuard] },
  { path: 'autores/:id', loadComponent: () => import('./autores/autores-form.component').then(m => m.AutoresFormComponent), canActivate: [bibliotecarioGuard] },
];
