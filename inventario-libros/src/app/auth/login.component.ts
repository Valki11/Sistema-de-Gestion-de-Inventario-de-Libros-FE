import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="login-card">
    <h2>Iniciar sesión</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>Usuario
        <input formControlName="nombreUsuario">
      </label>
      <label>Contraseña
        <input type="password" formControlName="contrasenaUsuario">
      </label>
      <button type="submit" [disabled]="form.invalid || loading">{{ loading ? 'Ingresando...' : 'Entrar' }}</button>
      <p class="error" *ngIf="error">{{ error }}</p>
    </form>
  </div>
  `,
  styles: [`
    .login-card{max-width:380px;margin:60px auto;padding:20px;border:1px solid #ddd;border-radius:12px}
    label{display:block;margin-bottom:.75rem}
    input{width:100%;padding:.5rem}
    button{margin-top:.5rem}
    .error{color:#b00020;margin-top:.5rem}
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.group({
    nombreUsuario: ['', Validators.required],
    contrasenaUsuario: ['', Validators.required]
  });

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    const data = {
      nombreUsuario: this.form.value.nombreUsuario ?? '',
      contrasenaUsuario: this.form.value.contrasenaUsuario ?? ''
    };

this.auth.login(data).subscribe({

      next: (user) => {
        Swal.fire({
          icon: 'success',
          title: `Bienvenido ${user.nombreUsuario}`,
          text: `Rol: ${user.rol}`,
          timer: 1500,
          showConfirmButton: false
        });

        // 🔹 Redirige según rol
        if (user.rol === 'Bibliotecario') {
          this.router.navigateByUrl('/libros');
        } else {
          this.router.navigateByUrl('/autores');
        }
      },
      error: (e) => {
        this.error = e?.error?.message ?? 'Credenciales inválidas';
        this.loading = false;
      }
    });
  }
}
