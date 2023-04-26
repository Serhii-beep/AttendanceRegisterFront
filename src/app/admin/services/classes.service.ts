import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Class } from 'src/app/dtos/class.dto';
import { ClassInfo } from 'src/app/dtos/classInfo.dto';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  private BASE_URL = "https://localhost:8081/api/Classes";

  constructor(private _httpClient: HttpClient) { }

  getAllClasses(): Observable<Class[]> {
    return this._httpClient.get<Class[]>(`${this.BASE_URL}`);
  }

  getById(id: number): Observable<Class> {
    return this._httpClient.get<Class>(`${this.BASE_URL}/${id}`);
  }

  getAllClassesIncluded(): Observable<ClassInfo[]> {
    return this._httpClient.get<ClassInfo[]>(`${this.BASE_URL}/included`);
  }

  getByTeacher(teacherId: number): Observable<ClassInfo[]> {
    return this._httpClient.get<ClassInfo[]>(`${this.BASE_URL}/teacher=${teacherId}`);
  }

  addClass(classs: Class): Observable<Class> {
    return this._httpClient.post<Class>(`${this.BASE_URL}`, classs);
  }

  deleteClassById(id: number): Observable<Class> {
    return this._httpClient.delete<Class>(`${this.BASE_URL}/${id}`);
  }

  updateClass(classs: Class): Observable<Class> {
    return this._httpClient.put<Class>(`${this.BASE_URL}`, classs);
  }
}
