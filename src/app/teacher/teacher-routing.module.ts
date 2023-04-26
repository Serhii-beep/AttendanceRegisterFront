import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherMainComponent } from './teacher-main/teacher-main.component';
import { TeacherClassesComponent } from './teacher-classes/teacher-classes.component';
import { TeacherSubjectComponent } from './teacher-subject/teacher-subject.component';

const routes: Routes = [
  {path: 'teacher', component: TeacherMainComponent, children: [
    {path: 'classes', component: TeacherClassesComponent},
    {path: 'subject/:classId/:subjectId', component: TeacherSubjectComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
