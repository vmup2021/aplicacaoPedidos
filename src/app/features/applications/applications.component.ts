import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationService } from '../../core/services/application.service';
import { AuthService } from '../../core/services/auth.service';
import { Application, ApplicationFormValue } from '../../core/models/application.model';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationComponent],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss',
})
export class ApplicationsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly applicationsService = inject(ApplicationService);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);

  readonly loading = signal(true);
  readonly applications = signal<Application[]>([]);
  readonly page = signal(0);
  readonly totalPages = signal(1);
  readonly totalElements = signal(0);
  readonly pesquisa = signal('');

  readonly panelOpen = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.group({
    codigo: ['', [Validators.required, Validators.maxLength(12)]],
    nome: ['', [Validators.required]],
    descricao: ['', [Validators.required]],
    ativa: [true],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.applicationsService.list(this.page(), 10, this.pesquisa()).subscribe({
      next: (result) => {
        this.applications.set(result.content);
        this.totalPages.set(result.totalPages);
        this.totalElements.set(result.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearchChange(): void {
    this.page.set(0);
    this.load();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.load();
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form.reset({ codigo: '', nome: '', descricao: '', ativa: true });
    this.errorMessage.set(null);
    this.panelOpen.set(true);
  }

  openEdit(app: Application): void {
    this.editingId.set(app.id);
    this.form.reset({ codigo: app.codigo, nome: app.nome, descricao: app.descricao, ativa: app.ativa });
    this.errorMessage.set(null);
    this.panelOpen.set(true);
  }

  startRequest(app: Application): void {
    if (!app.ativa) return;

    this.router.navigate(['/novo-pedido'], {
      queryParams: { aplicacaoId: app.id },
    });
  }

  closePanel(): void {
    this.panelOpen.set(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    const payload = this.form.getRawValue() as ApplicationFormValue;
    const id = this.editingId();
    const request$ = id ? this.applicationsService.update(id, payload) : this.applicationsService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.panelOpen.set(false);
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(err?.error?.message ?? 'Não foi possível guardar a aplicação.');
      },
    });
  }

  remove(app: Application): void {
    if (!confirm(`Eliminar a aplicação "${app.nome}"? Esta ação não pode ser revertida.`)) return;
    this.applicationsService.delete(app.id).subscribe(() => this.load());
  }
}
