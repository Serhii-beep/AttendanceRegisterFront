import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'src/app/dtos/subject.dto';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {

  private BASE_URL = "https://localhost:8081/api/subjects";

  constructor(private _httpClient: HttpClient) { }

  getAllSubjects(): Observable<Subject[]> {
    return this._httpClient.get<Subject[]>(`${this.BASE_URL}`);
  }

  getSubjectById(id: number): Observable<Subject> {
    return this._httpClient.get<Subject>(`${this.BASE_URL}/${id}`);
  }

  updateSubjectTeachersClasses(subject: Subject): Observable<Subject> {
    return this._httpClient.post<Subject>(`${this.BASE_URL}/teachers`, subject);
  }

  addSubject(subject: Subject): Observable<Subject> {
    return this._httpClient.post<Subject>(`${this.BASE_URL}`, subject);
  }

  deleteSubject(id: number): Observable<any> {
    return this._httpClient.delete<any>(`${this.BASE_URL}/${id}`);
  }
}
