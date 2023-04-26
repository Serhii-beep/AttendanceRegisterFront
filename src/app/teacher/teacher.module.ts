import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherMainComponent } from './teacher-main/teacher-main.component';
import { TeacherClassesComponent } from './teacher-classes/teacher-classes.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TeacherSubjectComponent } from './teacher-subject/teacher-subject.component';


@NgModule({
  declarations: [
    TeacherMainComponent,
    TeacherClassesComponent,
    TeacherSubjectComponent
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class TeacherModule { }
