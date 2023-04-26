import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Section } from 'src/app/dtos/section.dto';

@Injectable({
  providedIn: 'root'
})
export class SectionsService {
  private BASE_URL = "https://localhost:8081/api/Sections";

  constructor(private _httpClient: HttpClient) { }

  getAll(classId: number, subjectId: number): Observable<Section[]> {
    return this._httpClient.get<Section[]>(`${this.BASE_URL}/class=${classId}&subject=${subjectId}`);
  }
}
