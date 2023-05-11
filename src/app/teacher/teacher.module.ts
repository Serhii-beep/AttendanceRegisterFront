import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherMainComponent } from './teacher-main/teacher-main.component';
import { TeacherClassesComponent } from './teacher-classes/teacher-classes.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { TeacherSubjectComponent } from './teacher-subject/teacher-subject.component';
import { HoverPropagationDirective } from './hover-propagation.directive';
import { TeacherMarksComponent } from './teacher-marks/teacher-marks.component';
import { FormsModule } from '@angular/forms';
import { TeacherMarksAllComponent } from './teacher-marks-all/teacher-marks-all.component';


@NgModule({
  declarations: [
    TeacherMainComponent,
    TeacherClassesComponent,
    TeacherSubjectComponent,
    HoverPropagationDirective,
    TeacherMarksComponent,
    TeacherMarksAllComponent
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatSnackBarModule
  ]
})
export class TeacherModule { }
