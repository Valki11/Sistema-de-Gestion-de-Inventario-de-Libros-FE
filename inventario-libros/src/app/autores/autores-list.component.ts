import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { AutoresService } from '../services/autores.service';
import { AuthService } from '../auth/auth.service';
import { Autor } from '../models/autor';

// Export libs
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-autores-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
  <div class="container">
    <h2 class="mb-3">Autores</h2>

    <!-- 🔍 Barra de búsqueda -->
    <form [formGroup]="searchForm" class="grid gap-2 md:grid-cols-3 mb-3">
      <input class="form-control" placeholder="Buscar por nombre" formControlName="nombre">
     
  
      <div>
        <button type="button" class="btn btn-secondary" (click)="limpiar()">Limpiar</button>
      </div>
      <div>
        <a *ngIf="auth.isBibliotecario()" class="btn btn-primary" routerLink="/autores/nuevo">
          + Nuevo autor
        </a>
      </div>
      
      <div *ngIf="auth.isBibliotecario()">
          <button type="button" class="btn btn-outline" (click)="exportCSV()">CSV</button>
          <button type="button" class="btn btn-outline" (click)="exportExcel()">Excel</button>
          <button type="button" class="btn btn-outline" (click)="exportPDF()">PDF</button>
        </div>

    </form>

   <br>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Nombre del autor</th>
            <th *ngIf="auth.isBibliotecario()">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let a of filtrados; trackBy: trackById">
            <td>{{ a.nombreAutor }}</td>
            <td *ngIf="auth.isBibliotecario()" class="whitespace-nowrap">
              <button class="btn btn-sm btn-outline" (click)="editar(a.idAutor)">✏️</button>
              <button class="btn btn-sm btn-outline ms-1" (click)="eliminar(a.idAutor)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="filtrados.length === 0" class="text-muted p-3">
        No hay resultados para los filtros aplicados.
      </div>
    </div>
  </div>
  `,
  styles: [`
    .container { padding: 1rem; }
    .form-control { padding: .5rem .75rem; border: 1px solid #ddd; border-radius: .375rem; }
    .btn { padding: .45rem .8rem; border-radius: .375rem; }
    .btn-outline { border: 1px solid #ccc; }
    .btn-primary { background: #0d6efd; color: white; border: 0; }
    .btn-secondary { background: #6c757d; color: white; border: 0; }
    .btn-danger { background: #dc3545; color: white; border: 0; }
    .ms-1 { margin-left: .25rem; }
    .mb-3 { margin-bottom: 1rem; }
    .grid { display:grid; }
    .gap-2 { gap:.5rem; }
    .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    @media (max-width: 768px){ .md\\:grid-cols-3{ grid-template-columns: 1fr; } }
  `]
})
export class AutoresListComponent {
  public auth = inject(AuthService);
  private svc = inject(AutoresService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  originales: Autor[] = [];
  filtrados: Autor[] = [];

  searchForm = this.fb.group({
    nombre: this.fb.nonNullable.control<string>(''),
  });

  constructor() {
    // Carga inicial
    this.svc.getAll().subscribe({
      next: (data) => {
        this.originales = data ?? [];
        this.aplicarFiltro();
      },
      error: () => Swal.fire('Error', 'No se pudieron cargar los autores', 'error')
    });

    // Reaccionar a los cambios de búsqueda
    this.searchForm.valueChanges
      .pipe(
        startWith(this.searchForm.value),
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe(() => this.aplicarFiltro());
  }

  private normalizar(v: unknown): string {
    return (v ?? '').toString().trim().toLowerCase();
  }

  private aplicarFiltro(): void {
    const { nombre } = this.searchForm.getRawValue();
    const qNombre = this.normalizar(nombre);
    this.filtrados = this.originales.filter(a =>
      this.normalizar(a.nombreAutor).includes(qNombre)
    );
  }

  limpiar(): void {
    this.searchForm.reset({ nombre: '' });
  }

  editar(id?: number): void {
    if (typeof id !== 'number') return;
    this.router.navigate(['/autores', id]);
  }

  eliminar(id?: number): void {
    if (typeof id !== 'number') return;
    Swal.fire({
      icon: 'question',
      title: '¿Eliminar autor?',
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(res => {
      if (!res.isConfirmed) return;
      this.svc.delete(id).subscribe({
        next: () => {
          this.originales = this.originales.filter(x => x.idAutor !== id);
          this.aplicarFiltro();
          Swal.fire('Eliminado', 'Autor eliminado correctamente', 'success');
        },
        error: () => Swal.fire('Error', 'No se pudo eliminar el autor', 'error')
      });
    });
  }

  // =============================
  // 📤 EXPORTACIONES
  // =============================

  private mapAutoresForExport() {
    return this.filtrados.map(a => ({
      'ID': a.idAutor ?? '',
      'Nombre del Autor': a.nombreAutor ?? ''
    }));
  }

  private fileName(base: string, ext: string) {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    return `${base}_${yyyy}${mm}${dd}_${hh}${mi}.${ext}`;
  }

  /** CSV sin librerías */
  exportCSV(): void {
    const rows = this.mapAutoresForExport();
    if (!rows.length) return;

    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(','),
      ...rows.map(r => headers.map(h => {
        const val = (r as any)[h] ?? '';
        const s = String(val).replace(/"/g, '""');
        return `"${s}"`;
      }).join(','))
    ].join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, this.fileName('reporte_autores', 'csv'));
  }

  /** Excel con xlsx + file-saver */
  exportExcel(): void {
    const data = this.mapAutoresForExport();
    if (!data.length) return;

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Autores');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, this.fileName('reporte_autores', 'xlsx'));
  }

  /** PDF con jspdf + autotable */
  exportPDF(): void {
    const data = this.mapAutoresForExport();
    if (!data.length) return;

    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt' });
    doc.setFontSize(14);
    doc.text('Reporte de Autores', 40, 30);

    const columns = Object.keys(data[0]).map(k => ({ header: k, dataKey: k }));
    autoTable(doc, {
      head: [columns.map(c => c.header)],
      body: data.map(r => columns.map(c => (r as any)[c.dataKey])),
      startY: 50,
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [13, 110, 253] },
    });

    doc.save(this.fileName('reporte_autores', 'pdf'));
  }

  trackById = (_: number, a: Autor) => a.idAutor;
}
