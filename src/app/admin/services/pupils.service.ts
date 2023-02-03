import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Pupil } from 'src/app/dtos/pupil.dto';

@Injectable({
  providedIn: 'root'
})
export class PupilsService {
  private BASE_URL = "https://localhost:7288/api/Pupils";

  constructor(private httpClient: HttpClient) { }

  getAllPupilsPaginated(order: string, page: number, itemsPerPage: number): Observable<Pupil[]> {
    return this.httpClient.get<Pupil[]>(`${this.BASE_URL}/order=${order}&page=${page}&itemsPerPage=${itemsPerPage}`);
  }

  addPupil(pupil: Pupil): Observable<Pupil> {
    return this.httpClient.post<Pupil>(`${this.BASE_URL}`, pupil);
  }
}
