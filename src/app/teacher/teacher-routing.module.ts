import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherMainComponent } from './teacher-main/teacher-main.component';
import { TeacherClassesComponent } from './teacher-classes/teacher-classes.component';

const routes: Routes = [
  {path: 'teacher', component: TeacherMainComponent, children: [
    {path: 'classes', component: TeacherClassesComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
