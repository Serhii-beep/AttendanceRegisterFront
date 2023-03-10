import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminClassesComponent } from './admin-classes/admin-classes.component';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { AdminPupilsComponent } from './admin-pupils/admin-pupils.component';

const routes: Routes = [
  {path: 'admin', component: AdminMainComponent, children: [
    {path: 'pupils', component: AdminPupilsComponent},
    {path: 'classes', component: AdminClassesComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
