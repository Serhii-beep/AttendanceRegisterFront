import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { AdminPupilsComponent } from './admin-pupils/admin-pupils.component';
import { CreatePupilComponent } from './create-pupil/create-pupil.component';

const routes: Routes = [
  {path: 'admin', component: AdminMainComponent, children: [
    {path: 'pupils', component: AdminPupilsComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
