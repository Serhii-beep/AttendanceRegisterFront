import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { UserAuthorizationDto } from '../dtos/user-authorization.dto';
import { Admin } from '../dtos/admin.dto';
import { Observable } from 'rxjs';
import { Pupil } from '../dtos/pupil.dto';
import { Teacher } from '../dtos/teacher.dto';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  BASE_URL: string = "https://localhost:7288/api"

  constructor(private http: HttpClient) { }

  loginAdmin(user: UserAuthorizationDto): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/Admins/authenticate`, user);
  }

  loginPupil(user: UserAuthorizationDto): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/Pupils/authenticate`, user);
  }

  loginTeacher(user: UserAuthorizationDto): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/Admins/authenticate`, user);
  }
}
