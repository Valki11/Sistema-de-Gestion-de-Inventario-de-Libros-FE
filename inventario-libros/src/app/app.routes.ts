import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { bibliotecarioGuard } from './auth/role.guard';
import { usuariosGuard } from './auth/usuarios.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  
  { path: 'login', loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent) },

  
  { 
    path: 'libros', 
    loadComponent: () => import('./libros/libros-list.component').then(m => m.LibrosListComponent), 
    canActivate: [authGuard] 
  },
  { 
    path: 'libros/nuevo', 
    loadComponent: () => import('./libros/libros-form.component').then(m => m.LibrosFormComponent), 
    canActivate: [bibliotecarioGuard] 
  },
  { 
    path: 'libros/:id', 
    loadComponent: () => import('./libros/libros-form.component').then(m => m.LibrosFormComponent), 
    canActivate: [bibliotecarioGuard] 
  },

  { 
    path: 'autores', 
    loadComponent: () => import('./autores/autores-list.component').then(m => m.AutoresListComponent), 
    canActivate: [authGuard] 
  },
  { 
    path: 'autores/nuevo', 
    loadComponent: () => import('./autores/autores-form.component').then(m => m.AutoresFormComponent), 
    canActivate: [bibliotecarioGuard] 
  },
  { 
    path: 'autores/:id', 
    loadComponent: () => import('./autores/autores-form.component').then(m => m.AutoresFormComponent), 
    canActivate: [bibliotecarioGuard] 
  },

  { path: 'usuarios', loadComponent: () => import('./usuarios/usuarios-list.component').then(m => m.UsuariosListComponent), canActivate: [usuariosGuard] },
  { path: 'usuarios/nuevo', loadComponent: () => import('./usuarios/usuarios-form.component').then(m => m.UsuariosFormComponent), canActivate: [usuariosGuard] },
  { path: 'usuarios/:id', loadComponent: () => import('./usuarios/usuarios-form.component').then(m => m.UsuariosFormComponent), canActivate: [usuariosGuard] },
  
 { path: 'prestamos', loadComponent: () => import('./prestamos/prestamos-list.component').then(m => m.PrestamosListComponent), canActivate: [authGuard] },
  { path: 'prestamos/nuevo', loadComponent: () => import('./prestamos/prestamos-form.component').then(m => m.PrestamosFormComponent), canActivate: [bibliotecarioGuard] },

  { path: '**', redirectTo: 'libros' },
];
