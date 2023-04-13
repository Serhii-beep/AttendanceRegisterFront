import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Class } from 'src/app/dtos/class.dto';
import { ClassInfo } from 'src/app/dtos/classInfo.dto';
import { ClassProfile } from 'src/app/dtos/classProfile.dto';
import { ClassProfilesService } from '../services/class-profiles.service';
import { ClassesService } from '../services/classes.service';
import { TeachersService } from '../services/teachers.service';
import { Teacher } from 'src/app/dtos/teacher.dto';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage-class',
  templateUrl: './manage-class.component.html',
  styleUrls: ['./manage-class.component.scss']
})
export class ManageClassComponent implements OnInit, OnDestroy {
  classForm!: FormGroup;
  class!: ClassInfo;
  profiles!: ClassProfile[];
  teachers!: Teacher[];
  action!: string;
  btnText!: string;
  classSub!: Subscription;
  teachersSub!: Subscription;
  profilesSub!: Subscription;
  selectedProfileId = -1;
  selectedTeacherId = -1;
  constructor(private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private _classesService: ClassesService,
    private _classProfilesService: ClassProfilesService,
    private _teachersService: TeachersService,
    public dialogRef: MatDialogRef<ManageClassComponent>) { 
      this.class = {
        id: 0,
        name: "",
        profileName: "",
        numberOfPupils: 0,
        supervisor: ""
      }
    }

  ngOnInit(): void {
    this.classForm = this.formBuilder.group({
      className: ['', Validators.required]
    })
    this.profilesSub = this._classProfilesService.getAll().subscribe((resp: ClassProfile[]) => {
      this.profiles = resp;
      if(this.action == "edit") {
        this.selectedProfileId = this.profiles.filter(p => p.profileName == this.class.profileName)[0].id;
      }
    });
    this.teachersSub = this._teachersService.getAllteachersPaginated('desc', 0, 30).subscribe((resp) => {
      this.teachers = resp;
      if(this.action == "edit") {
        this.selectedTeacherId = this.teachers.filter(t => t.fullName == this.class.supervisor)[0].id;
      }
    })
  }

  btnSubmitClick() {
    if(!this.classForm.valid || this.selectedProfileId < 0 || this.selectedTeacherId < 0) {
      this.classForm.markAllAsTouched();
      this.snackBar.open("Виправте всі помилки", "Ok");
      return;
    }
    if(this.action == "edit") {
      let classProfileId = this.profiles.filter(cp => cp.profileName == this.class.profileName)[0].id;
      let supervId = this.teachers.filter(t => t.fullName == this.class.supervisor)[0].id;
      this.classSub = this._classesService.updateClass({id: this.class.id, name: this.class.name, classProfileId: classProfileId, teacherId: supervId})
        .subscribe((resp: Class) => this.dialogRef.close("success"), error => console.log(error));
    }
    if(this.action == "add") {
      this.classSub = this._classesService.addClass({id: 0, name: this.class.name, classProfileId: this.selectedProfileId, teacherId: this.selectedTeacherId })
        .subscribe((resp: Class) => {
          this.dialogRef.close("success")
        }, error => console.log(error));
    }
  }

  ngOnDestroy(): void {
    if(this.classSub)
    {
      this.classSub.unsubscribe();
    }
    if(this.profilesSub) {
      this.profilesSub.unsubscribe();
    }
    if(this.teachersSub) {
      this.teachersSub.unsubscribe();
    }
  }
}
