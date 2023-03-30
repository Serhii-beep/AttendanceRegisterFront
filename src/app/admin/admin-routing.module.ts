import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminClassesComponent } from './admin-classes/admin-classes.component';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { AdminPupilsComponent } from './admin-pupils/admin-pupils.component';
import { AdminSubjectsComponent } from './admin-subjects/admin-subjects.component';
import { AdminTeachersComponent } from './admin-teachers/admin-teachers.component';

const routes: Routes = [
  {path: 'admin', component: AdminMainComponent, children: [
    {path: 'pupils', component: AdminPupilsComponent},
    {path: 'teachers', component: AdminTeachersComponent},
    {path: 'classes', component: AdminClassesComponent},
    {path: 'subjects', component: AdminSubjectsComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
