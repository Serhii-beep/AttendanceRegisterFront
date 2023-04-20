import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { SubjectsService } from '../services/subjects.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-subject',
  templateUrl: './create-subject.component.html',
  styleUrls: ['./create-subject.component.scss']
})
export class CreateSubjectComponent implements OnInit {
  subjectForm!: FormGroup;
  name = '';
  subjectSub!: Subscription;

  constructor(private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private subjectService: SubjectsService,
    private dialogRef: MatDialogRef<CreateSubjectComponent>) { }

  ngOnInit(): void {
    this.subjectForm = this.formBuilder.group({
      subjectName: ['', Validators.required]
    });
  }

  btnSubmitClick() {
    if(!this.subjectForm.valid) {
      this.subjectForm.markAllAsTouched();
      return;
    }
    this.subjectSub = this.subjectService.addSubject({id: 0, name: this.name, teachers: [], classes: []}).subscribe((resp) => {
      this.dialogRef.close("success");
    }, error => console.log(error));
  }
}
