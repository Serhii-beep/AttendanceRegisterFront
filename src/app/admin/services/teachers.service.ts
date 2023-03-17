import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Teacher } from 'src/app/dtos/teacher.dto';

@Injectable({
  providedIn: 'root'
})
export class TeachersService {
  private BASE_URL = "https://localhost:8081/api/Teachers";

  constructor(private _httpClient: HttpClient) { }

  getAllteachersPaginated(order: string, page: number, itemsPerPage: number): Observable<Teacher[]> {
    return this._httpClient.get<Teacher[]>(`${this.BASE_URL}/order=${order}&page=${page}&itemsPerPage=${itemsPerPage}`);
  }

  addTeacher(teacher: Teacher): Observable<Teacher> {
    return this._httpClient.post<Teacher>(`${this.BASE_URL}`, teacher);
  }

  updateTeacher(teacher: Teacher): Observable<Teacher> {
    return this._httpClient.put<Teacher>(`${this.BASE_URL}`, teacher);
  }

  deleteTeacher(id: number): Observable<any> {
    return this._httpClient.delete(`${this.BASE_URL}/${id}`);
  }
}
