import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Subscription } from 'rxjs';
import { ClassProfile } from 'src/app/dtos/classProfile.dto';
import { ClassProfilesService } from '../services/class-profiles.service';
import { ValidateBirthDate } from 'src/app/shared/validators/birthDateValidator.validator';
import { PupilsService } from '../services/pupils.service';
import { Pupil } from 'src/app/dtos/pupil.dto';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-pupil',
  templateUrl: './create-pupil.component.html',
  styleUrls: ['./create-pupil.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ]
})
export class CreatePupilComponent implements OnInit, OnDestroy {
  personalDataForm!: FormGroup;
  accountDataForm!: FormGroup;
  classDataForm!: FormGroup;
  classes!: ClassProfile[];
  classProfilesSub!: Subscription;
  pupilSub!: Subscription;
  pupil!: Pupil;
  resultButtonText!: string;
  action!: string;

  constructor(private formBuilder: FormBuilder,
    private classProfilesService: ClassProfilesService,
    private pupilService: PupilsService,
    private router: Router,
    public dialogRef: MatDialogRef<CreatePupilComponent>) {
      this.pupil = {
        id: 0,
        fullName: '',
        email: '',
        class: {
          id: 0,
          name: '',
          classProfileId: 0
        },
        address: '',
        birthDate: new Date(),
        login: '',
        password: '',
        role: 'pupil'
      }
    }

  ngOnInit(): void {
    this.personalDataForm = this.formBuilder.group({
      fullNameControl: ['', Validators.required],
      addressControl: ['', Validators.required],
      birthDateControl: ['', { validators: [Validators.required, ValidateBirthDate] }]
    });

    this.accountDataForm = this.formBuilder.group({
      emailControl: ['', { validators: [Validators.required, Validators.email] }],
      loginControl: ['', Validators.required],
      passwordControl: ['', Validators.required]
    });

    this.classDataForm = this.formBuilder.group({
      classControl: ['', Validators.required]
    });

    this.classProfilesSub = this.classProfilesService.getAllWithClasses().subscribe((resp: any) => {
      this.classes = resp;
      this.pupil.class = this.classes[0].classes[0];
    }, error => console.log(error));
  }

  getEmailValidationError(): string {
    if(this.accountDataForm.get('emailControl')?.hasError('required')) {
      return 'Це поле є обов\'язковим';
    }
    if(this.accountDataForm.get('emailControl')?.hasError('email')) {
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
