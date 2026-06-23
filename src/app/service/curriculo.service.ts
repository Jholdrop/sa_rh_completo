import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Curriculo, CurriculoId } from '../model/curriculo.model';

@Injectable({
  providedIn: 'root',
})
export class CurriculoService {
  private readonly apiUrl = 'http://localhost:3010/curriculos';

  constructor(private http: HttpClient) {}

  getTodosCurriculos(): Observable<Curriculo[]> {
    return this.http.get<Curriculo[]>(this.apiUrl);
  }

  getCurriculoById(id: CurriculoId): Observable<Curriculo> {
    return this.http.get<Curriculo>(`${this.apiUrl}/${id}`);
  }

  getCurriculoByUsuarioId(usuarioId: number): Observable<Curriculo[]> {
    const params = new HttpParams().set('usuarioId', String(usuarioId));
    return this.http.get<Curriculo[]>(this.apiUrl, { params });
  }

  getCurriculosByVagaId(vagaId: CurriculoId): Observable<Curriculo[]> {
    const params = new HttpParams().set('vagaId', String(vagaId));
    return this.http.get<Curriculo[]>(this.apiUrl, { params });
  }

  postCurriculo(curriculo: Curriculo): Observable<Curriculo> {
    return this.http.post<Curriculo>(this.apiUrl, curriculo);
  }

  putCurriculo(curriculo: Curriculo): Observable<Curriculo> {
    if (curriculo.id === undefined || curriculo.id === null || curriculo.id === '') {
      return throwError(() => new Error('Curriculo sem id para atualizacao.'));
    }

    return this.http.put<Curriculo>(`${this.apiUrl}/${curriculo.id}`, curriculo);
  }

  deleteCurriculo(id: CurriculoId): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
