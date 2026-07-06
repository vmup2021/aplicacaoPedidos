import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserFormValue } from '../models/user.model';
import { Page } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly base = `${environment.apiUrl}/utilizadores`;

  constructor(private readonly http: HttpClient) {}

  list(page = 0, size = 10, pesquisa = ''): Observable<Page<User>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (pesquisa) params = params.set('pesquisa', pesquisa);
    return this.http.get<Page<User>>(this.base, { params });
  }

  listAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.base}/todos`);
  }

  create(payload: UserFormValue): Observable<User> {
    return this.http.post<User>(this.base, payload);
  }

  update(id: number, payload: UserFormValue): Observable<User> {
    return this.http.put<User>(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
