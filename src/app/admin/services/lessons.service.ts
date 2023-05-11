import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LessonInfo } from 'src/app/dtos/lesson-info.dto';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {
  private BASE_URL = "https://localhost:8081/api/Lessons";

  constructor(private _httpClient: HttpClient) { }

  getLessonsBySection(sectionId: number): Observable<LessonInfo[]> {
    return this._httpClient.get<LessonInfo[]>(`${this.BASE_URL}/${sectionId}`);
  }
}
