import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserAuthorizationDto } from 'src/app/dtos/user-authorization.dto';
import { HttpService } from '../http.service';
import { Subscription } from 'rxjs';
import { Admin } from 'src/app/dtos/admin.dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  AuthorizationForm!: FormGroup;
  user: UserAuthorizationDto = {username: '', password: ''};
  loginSubscr!: Subscription;

  constructor(private formBuilder: FormBuilder,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    this.AuthorizationForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
      role: ['']
    })
  }

  async login() {
    if(this.AuthorizationForm.invalid) {
      return;
    }
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    const resp = await this.httpService.loginAdmin(this.user).toPromise();
    localStorage.setItem('userToken', resp.token);
    localStorage.setItem('currentUser', JSON.stringify(resp.user));
    localStorage.setItem('userRole', resp.user.role);
    const role = localStorage.getItem('userRole');
    switch(role) {
      case 'admin': {
        this.router.navigate(['admin/pupils']);
        break;
      }
      case 'pupil': {
        this.router.navigate(['pupil/subjects']);
        break;
      }
      case 'teacher': {
        this.router.navigate(['teacher/classes']);
        break;
      }
    }
  }

  setUserError(error: any): void {
    console.log(error);
    this.snackBar.open(error.error, 'Close');
  }

  ngOnDestroy(): void {
    if(this.loginSubscr) {
      this.loginSubscr.unsubscribe();
    }
  }
}
