import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';

export const usuariosGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    Swal.fire('Acceso denegado', 'Debe iniciar sesión primero', 'warning');
    router.navigateByUrl('/login');
    return false;
  }

  if (!auth.isBibliotecario()) {
    Swal.fire('Sin permisos', 'Solo los bibliotecarios pueden acceder a esta sección', 'error');
    router.navigateByUrl('/libros');
    return false;
  }

  return true;
};
