import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuditLog, AuditLogFilters } from '../models/audit-log.model';
import { Page } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private readonly base = `${environment.apiUrl}/auditoria`;

  constructor(private readonly http: HttpClient) {}

  list(filters: AuditLogFilters): Observable<Page<AuditLog>> {
    let params = new HttpParams().set('page', filters.page ?? 0).set('size', filters.size ?? 10);
    if (filters.utilizadorId && filters.utilizadorId !== 'TODOS') params = params.set('utilizadorId', filters.utilizadorId);
    if (filters.acao && filters.acao !== 'TODOS') params = params.set('acao', filters.acao);
    if (filters.dataInicio) params = params.set('dataInicio', filters.dataInicio);
    if (filters.dataFim) params = params.set('dataFim', filters.dataFim);
    if (filters.pesquisa) params = params.set('pesquisa', filters.pesquisa);
    return this.http.get<Page<AuditLog>>(this.base, { params });
  }
}
