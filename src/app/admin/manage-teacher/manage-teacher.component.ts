import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Teacher } from 'src/app/dtos/teacher.dto';
import { TeachersService } from '../services/teachers.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage-teacher',
  templateUrl: './manage-teacher.component.html',
  styleUrls: ['./manage-teacher.component.scss']
})
export class ManageTeacherComponent implements OnInit, OnDestroy {
  teacherForm!: FormGroup;
  teacher!: Teacher;
  resultButtonText!: string;
  action!: string;
  teacherSub!: Subscription;
  firstName = "";
  lastName = "";
  middleName = "";

  constructor(private formBuilder: FormBuilder,
    private teachersService: TeachersService,
    private snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<ManageTeacherComponent>) {
      this.teacher = {
        id: 0,
        login: '',
        password: '',
        fullName: '',
        email: '',
        role: 'teacher'
      }
     }

  ngOnInit(): void {
    this.teacherForm = this.formBuilder.group({
      firstNameControl: ['', Validators.required],
      lastNameControl: ['', Validators.required],
      middleNameControl: ['', Validators.required],
      emailControl: ['', { validators: [Validators.required, Validators.email] }],
      loginControl: ['', Validators.required],
      passwordControl: ['', Validators.required]
    });
    if(this.action == "edit") {
      this.firstName = this.teacher.fullName.split(' ')[0];
      this.lastName = this.teacher.fullName.split(' ')[1];
      this.middleName = this.teacher.fullName.split(' ')[2];
    }
  }

  getEmailValidationError(): string {
    if(this.teacherForm.get('emailControl')?.hasError('required')) {
      return 'Це поле є обов\'язковим';
    }
    if(this.teacherForm.get('emailControl')?.hasError('email')) {
      return 'Неправильний формат електронної адреси';
    }
    return '';
  }

  addTeacher() {
    if(!this.teacherForm.valid) {
      this.teacherForm.markAllAsTouched();
      this.snackbar.open("Виправте всі помилки", "Ok");
      return;
    }
    this.teacher.fullName = this.firstName + ' ' + this.lastName + ' ' + this.middleName;
    if(this.action == "create") {
      this.teacherSub = this.teachersService.addTeacher(this.teacher).subscribe((resp: any) => {
        this.dialogRef.close("success");
      }, error => console.log(error));
    }
    else if(this.action == "edit") {
      this.teacherSub = this.teachersService.updateTeacher(this.teacher).subscribe((resp: any) => {
        this.dialogRef.close("success");
      }, error => console.log(error));
    }
  }

  ngOnDestroy(): void {
    if(this.teacherSub) {
      this.teacherSub.unsubscribe();
    }
  }
}
