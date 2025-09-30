import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },


  { path: 'login', loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent) },


  { path: 'libros', canActivate: [authGuard], loadComponent: () => import('./libros/libros-list.component').then(m => m.LibrosListComponent) },
  { path: 'libros/nuevo', canActivate: [authGuard], loadComponent: () => import('./libros/libros-form.component').then(m => m.LibrosFormComponent) },
  { path: 'libros/:id', canActivate: [authGuard], loadComponent: () => import('./libros/libros-form.component').then(m => m.LibrosFormComponent) },


  { path: 'usuarios', canActivate: [authGuard], loadComponent: () => import('./usuarios/usuarios-list.component').then(m => m.UsuariosListComponent) },
  { path: 'usuarios/nuevo', canActivate: [authGuard], loadComponent: () => import('./usuarios/usuarios-form.component').then(m => m.UsuariosFormComponent) },
  { path: 'usuarios/:id', canActivate: [authGuard], loadComponent: () => import('./usuarios/usuarios-form.component').then(m => m.UsuariosFormComponent) },


  { path: 'autores', canActivate: [authGuard], loadComponent: () => import('./autores/autores-list.component').then(m => m.AutoresListComponent) },
  { path: 'autores/nuevo', canActivate: [authGuard], loadComponent: () => import('./autores/autores-form.component').then(m => m.AutoresFormComponent) },
  { path: 'autores/:id', canActivate: [authGuard], loadComponent: () => import('./autores/autores-form.component').then(m => m.AutoresFormComponent) },


  { path: '**', redirectTo: 'login' }
];
