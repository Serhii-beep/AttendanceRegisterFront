import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Class } from 'src/app/dtos/class.dto';
import { ClassInfo } from 'src/app/dtos/classInfo.dto';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  private BASE_URL = "https://localhost:7288/api/Classes";

  constructor(private _httpClient: HttpClient) { }

  getAllClasses(): Observable<Class[]> {
    return this._httpClient.get<Class[]>(`${this.BASE_URL}`);
  }

  getAllClassesIncluded(): Observable<ClassInfo[]> {
    return this._httpClient.get<ClassInfo[]>(`${this.BASE_URL}/included`);
  }
}