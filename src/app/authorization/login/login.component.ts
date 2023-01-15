import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserAuthorizationDto } from 'src/app/dtos/user-authorization.dto';
import { HttpService } from '../http.service';
import { Subscription } from 'rxjs';
import { Admin } from 'src/app/dtos/admin.dto';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  AuthorizationForm!: FormGroup;
  selectedRole: string = "pupil";
  user: UserAuthorizationDto = {username: '', password: ''};
  loginSubscr!: Subscription;

  constructor(private formBuilder: FormBuilder,
    private httpService: HttpService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.AuthorizationForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
      role: ['']
    })
  }

  login(): void {
    if(this.AuthorizationForm.invalid) {
      return;
    }
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    switch(this.selectedRole) {
      case 'admin': {
        this.loginSubscr = this.httpService.loginAdmin(this.user).subscribe((resp: any) => {
          localStorage.setItem('userToken', resp.token);
          localStorage.setItem('currentUser', JSON.stringify(resp.user));
          localStorage.setItem('userRole', 'admin');
        }, error => this.setUserError(error));
        break;
      }
      case 'pupil': {
        this.loginSubscr = this.httpService.loginPupil(this.user).subscribe((resp: any) => {
          localStorage.setItem('userToken', resp.token);
          localStorage.setItem('currentUser', JSON.stringify(resp.user));
          localStorage.setItem('userRole', 'pupil');
        }, error => this.setUserError(error));
        break;
      }
      case 'teacher': {
        this.loginSubscr = this.httpService.loginTeacher(this.user).subscribe((resp: any) => {
          localStorage.setItem('userToken', resp.token);
          localStorage.setItem('currentUser', JSON.stringify(resp.user));
          localStorage.setItem('userRole', 'teacher');
        });
        break;
      }
    }
  }

  setUserError(error: any): void {
    this.snackBar.open(error.error, 'Close');
  }

  ngOnDestroy(): void {
    if(this.loginSubscr) {
      this.loginSubscr.unsubscribe();
    }
  }
}
