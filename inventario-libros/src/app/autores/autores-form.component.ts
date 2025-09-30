import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AutoresService } from '../services/autores.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  selector: 'app-autores-form',
  template: `
  <h2>{{isEdit ? 'Editar' : 'Nuevo'}} autor</h2>
  <form [formGroup]="form" (ngSubmit)="save()">
    <label>Nombre <input formControlName="nombreAutor" required></label>
    <div class="actions">
      <button type="submit" [disabled]="form.invalid">Guardar</button>
      <a routerLink="/autores">Cancelar</a>
    </div>
  </form>
  `
})
export class AutoresFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private svc = inject(AutoresService);

  isEdit = false;
  id?: number;

  form = this.fb.group({
    nombreAutor: ['', Validators.required]
  });

  ngOnInit(){
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.id;
    if(this.isEdit){
      this.svc.getById(this.id!).subscribe(a => this.form.patchValue(a));
    }
  }

  save(){
    const value = this.form.getRawValue();
    if(this.isEdit){
      this.svc.update(this.id!, value).subscribe(()=> this.router.navigateByUrl('/autores'));
    } else {
      this.svc.create(value).subscribe(()=> this.router.navigateByUrl('/autores'));
    }
  }
}
