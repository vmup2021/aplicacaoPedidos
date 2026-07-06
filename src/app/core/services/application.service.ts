import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Application, ApplicationFormValue } from '../models/application.model';
import { Page } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private readonly base = `${environment.apiUrl}/aplicacoes`;

  constructor(private readonly http: HttpClient) {}

  list(page = 0, size = 10, pesquisa = ''): Observable<Page<Application>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (pesquisa) params = params.set('pesquisa', pesquisa);
    return this.http.get<Page<Application>>(this.base, { params });
  }

  /** All active applications, used to populate the "Novo Pedido" select. */
  listActive(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.base}/ativas`);
  }

  create(payload: ApplicationFormValue): Observable<Application> {
    return this.http.post<Application>(this.base, payload);
  }

  update(id: number, payload: ApplicationFormValue): Observable<Application> {
    return this.http.put<Application>(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
