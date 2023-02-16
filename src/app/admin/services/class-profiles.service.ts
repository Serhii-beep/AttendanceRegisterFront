import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClassProfile } from 'src/app/dtos/classProfile.dto';

@Injectable({
  providedIn: 'root'
})
export class ClassProfilesService {
  private BASE_URL = "https://localhost:7288/api/ClassProfiles";

  constructor(private _httpClient: HttpClient) { }

  getAllWithClasses(): Observable<ClassProfile[]> {
    return this._httpClient.get<ClassProfile[]>(`${this.BASE_URL}/included`);
  }

  getAll(): Observable<ClassProfile[]> {
    return this._httpClient.get<ClassProfile[]>(`${this.BASE_URL}`);
  }
}
