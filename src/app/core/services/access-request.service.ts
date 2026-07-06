import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AccessRequest,
  DashboardSummary,
  DecisionPayload,
  NewAccessRequestPayload,
  RequestFilters,
} from '../models/access-request.model';
import { Page } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class AccessRequestService {
  private readonly base = `${environment.apiUrl}/requests`;

  constructor(private readonly http: HttpClient) {}

  /** "Meus Pedidos" — requests created by the logged-in colaborador. */
  getMyRequests(filters: RequestFilters): Observable<Page<AccessRequest>> {
    return this.http.get<Page<AccessRequest>>(`${this.base}/me`, { params: this.toParams(filters) });
  }

  /** "Pedidos Pendentes" — queue for the approver, defaults to PENDENTE state. */
  getPendingRequests(filters: RequestFilters): Observable<Page<AccessRequest>> {
    return this.http.get<Page<AccessRequest>>(`${this.base}/pendentes`, { params: this.toParams(filters) });
  }

  /** "Todos os Pedidos" — full history view available to approvers. */
  getAllRequests(filters: RequestFilters): Observable<Page<AccessRequest>> {
    return this.http.get<Page<AccessRequest>>(this.base, { params: this.toParams(filters) });
  }

  getById(id: number): Observable<AccessRequest> {
    return this.http.get<AccessRequest>(`${this.base}/${id}`);
  }

  create(payload: NewAccessRequestPayload): Observable<AccessRequest> {
    return this.http.post<AccessRequest>(this.base, payload);
  }

  decide(id: number, payload: DecisionPayload): Observable<AccessRequest> {
    return this.http.put<AccessRequest>(`${this.base}/${id}/decisao`, payload);
  }

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.base}/dashboard`);
  }

  private toParams(filters: RequestFilters): HttpParams {
    let params = new HttpParams();
    if (filters.estado && filters.estado !== 'TODOS') params = params.set('estado', filters.estado);
    if (filters.aplicacaoId && filters.aplicacaoId !== 'TODOS') params = params.set('aplicacaoId', filters.aplicacaoId);
    if (filters.colaboradorId && filters.colaboradorId !== 'TODOS') params = params.set('colaboradorId', filters.colaboradorId);
    if (filters.pesquisa) params = params.set('pesquisa', filters.pesquisa);
    params = params.set('page', filters.page ?? 0);
    params = params.set('size', filters.size ?? 10);
    return params;
  }
}
