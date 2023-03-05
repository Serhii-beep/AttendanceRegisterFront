import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Class } from 'src/app/dtos/class.dto';
import { ClassInfo } from 'src/app/dtos/classInfo.dto';
import { ClassProfile } from 'src/app/dtos/classProfile.dto';
import { ClassProfilesService } from '../services/class-profiles.service';
import { ClassesService } from '../services/classes.service';

@Component({
  selector: 'app-manage-class',
  templateUrl: './manage-class.component.html',
  styleUrls: ['./manage-class.component.scss']
})
export class ManageClassComponent implements OnInit, OnDestroy {
  classForm!: FormGroup;
  class!: ClassInfo;
  profiles!: ClassProfile[];
  action!: string;
  btnText!: string;
  classSub!: Subscription;
  profilesSub!: Subscription;
  selectedProfileId!: number;
  constructor(private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _classesService: ClassesService,
    private _classProfilesService: ClassProfilesService,
    public dialogRef: MatDialogRef<ManageClassComponent>) { 
      this.class = {
        id: 0,
        name: "",
        profileName: "",
        numberOfPupils: 0
      }
    }

  ngOnInit(): void {
    this.classForm = this.formBuilder.group({
      className: ['', Validators.required]
    })
    this.profilesSub = this._classProfilesService.getAll().subscribe((resp: ClassProfile[]) => {
      this.profiles = resp;
    });
  }

  btnSubmitClick() {
    if(this.action == "edit") {
      let classProfileId = this.profiles.filter(cp => cp.profileName == this.class.profileName)[0].id;
      this.classSub = this._classesService.updateClass({id: this.class.id, name: this.class.name, classProfileId: classProfileId})
        .subscribe((resp: Class) => this.dialogRef.close("success"), error => console.log(error));
    }
    if(this.action == "add") {
      this.classSub = this._classesService.addClass({id: 0, name: this.class.name, classProfileId: this.selectedProfileId })
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
  }
}
