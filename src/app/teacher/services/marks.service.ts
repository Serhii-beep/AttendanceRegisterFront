import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LessonInfo } from 'src/app/dtos/lesson-info.dto';

@Injectable({
  providedIn: 'root'
})
export class MarksService {
  private BASE_URL = "https://localhost:8081/api/Lessons";

  constructor(private _httpClient: HttpClient) { }

  updateMarks(marks: LessonInfo[]): Observable<LessonInfo[]> {
    return this._httpClient.post<LessonInfo[]>(`${this.BASE_URL}`, marks);
  }

  getBySubjectClass(subjectClassId: number): Observable<LessonInfo[]> {
    return this._httpClient.get<LessonInfo[]>(`${this.BASE_URL}/sc=${subjectClassId}`);
  }

  getByPupilSubject(pupilId: number, subjectId: number): Observable<LessonInfo[]> {
    return this._httpClient.get<LessonInfo[]>(`${this.BASE_URL}/pupil=${pupilId}&subject=${subjectId}`);
  }

  generateTerm(term: number, subjectClassId: number): Observable<LessonInfo[]> {
    return this._httpClient.get<LessonInfo[]>(`${this.BASE_URL}/generate/${term}/${subjectClassId}`);
  }

  exportToExcel(subjectClassId: number): Observable<HttpResponse<Blob>> {
    return this._httpClient.get(`${this.BASE_URL}/${subjectClassId}/export`, {
      responseType: 'blob',
      observe: 'response'
    });
  }
}
