import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ClassProfilesService } from '../services/class-profiles.service';
import { ValidateBirthDate } from 'src/app/shared/validators/birthDateValidator.validator';
import { PupilsService } from '../services/pupils.service';
import { Pupil } from 'src/app/dtos/pupil.dto';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { Class } from 'src/app/dtos/class.dto';
import { ClassesService } from '../services/classes.service';
import * as $ from 'jquery';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-pupil',
  templateUrl: './create-pupil.component.html',
  styleUrls: ['./create-pupil.component.scss']
})
export class CreatePupilComponent implements OnInit, AfterViewInit, OnDestroy {
  pupilForm!: FormGroup;
  classes!: Class[];
  classProfilesSub!: Subscription;
  pupilSub!: Subscription;
  pupil!: Pupil;
  resultButtonText!: string;
  action!: string;
  firstName = '';
  lastName = '';
  middleName = '';
  selectedClassId = 0;

  constructor(private formBuilder: FormBuilder,
    private classService: ClassesService,
    private pupilService: PupilsService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreatePupilComponent>) {
      this.pupil = {
        id: 0,
        fullName: '',
        email: '',
        class: {
          id: 0,
          name: '',
          classProfileId: 0,
          teacherId: 0
        },
        address: '',
        birthDate: new Date(),
        login: '',
        password: '',
        role: 'pupil'
      }
    }

  async ngOnInit() {
    this.pupilForm = this.formBuilder.group({
      firstNameControl: ['', Validators.required],
      lastNameControl: ['', Validators.required],
      middleNameControl: ['', Validators.required],
      emailControl: ['', { validators: [Validators.required, Validators.email] }],
      birthDateControl: ['', { validators: [Validators.required, ValidateBirthDate] }],
      passwordControl: ['', Validators.required],
      loginControl: ['', Validators.required],
      addressControl: ['', Validators.required]
    });

    this.classes = await this.classService.getAllClasses().toPromise();
    this.classes = this.classes.sort((c1, c2) => {
      const first = parseInt(c1.name.substring(0, c1.name.indexOf('-') + 1));
      const second = parseInt(c2.name.substring(0, c2.name.indexOf('-') + 1));
      const firstL = c1.name.substring(c1.name.indexOf('-'));
      const secondL = c2.name.substring(c2.name.indexOf('-'));
      return first == second ? firstL.localeCompare(secondL) : first - second;
    });
    if(this.action == "edit") {
      this.firstName = this.pupil.fullName.split(' ')[0];
      this.lastName = this.pupil.fullName.split(' ')[1];
      this.middleName = this.pupil.fullName.split(' ')[2];
    }
  }

  ngAfterViewInit(): void {
  }

  getEmailValidationError(): string {
    if(this.pupilForm.get('emailControl')?.hasError('required')) {
      return 'Це поле є обов\'язковим';
    }
    if(this.pupilForm.get('emailControl')?.hasError('email')) {
      return 'Неправильний формат електронної адреси';
    }
    return '';
  }

  birthDateFilter = (d: Date | null): boolean => {
    if(d == null) {
      d = new Date();
    }
    return d < new Date();
  }

  addPupil() {
    if(!this.pupilForm.valid) {
      this.pupilForm.markAllAsTouched();
      this.snackBar.open("Виправте всі помилки", "Ok");
      return;
    }
    this.pupil.fullName = this.firstName + ' ' + this.lastName + ' ' + this.middleName;
    if(this.action == "create") {
      this.pupilSub = this.pupilService.addPupil(this.pupil).subscribe((resp: any) => {
        this.dialogRef.close("success");
      }, error => console.log(error));
    } else if(this.action == "edit") {
      this.pupilSub = this.pupilService.updatePupil(this.pupil).subscribe((resp: Pupil) => {
        this.dialogRef.close("success");
      }, error => console.log(error));
    }
  }

  ngOnDestroy(): void {
    if(this.classProfilesSub) {
      this.classProfilesSub.unsubscribe();
    }
    if(this.pupilSub) {
      this.pupilSub.unsubscribe();
    }
  }
}
