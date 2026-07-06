import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditLogService } from '../../core/services/audit-log.service';
import { UserService } from '../../core/services/user.service';
import { AuditLog, AuditLogFilters } from '../../core/models/audit-log.model';
import { User } from '../../core/models/user.model';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './audit-log.component.html',
  styleUrl: './audit-log.component.scss',
})
export class AuditLogComponent implements OnInit {
  readonly loading = signal(true);
  readonly logs = signal<AuditLog[]>([]);
  readonly users = signal<User[]>([]);
  readonly page = signal(0);
  readonly totalPages = signal(1);
  readonly totalElements = signal(0);

  filters: AuditLogFilters = { utilizadorId: 'TODOS', acao: 'TODOS', dataInicio: '', pesquisa: '' };

  readonly acoes = ['CRIAR_PEDIDO', 'APROVAR_PEDIDO', 'REJEITAR_PEDIDO', 'ALTERAR_ESTADO', 'CRIAR_UTILIZADOR', 'EDITAR_UTILIZADOR'];

  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly usersService: UserService,
  ) {}

  ngOnInit(): void {
    this.usersService.listAll().subscribe((users) => this.users.set(users));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.auditLogService.list({ ...this.filters, page: this.page(), size: 10 }).subscribe({
      next: (result) => {
        this.logs.set(result.content);
        this.totalPages.set(result.totalPages);
        this.totalElements.set(result.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onFilterChange(): void {
    this.page.set(0);
    this.load();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.load();
  }
}
