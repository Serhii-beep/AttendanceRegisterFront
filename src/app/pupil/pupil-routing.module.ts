import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PupilMainComponent } from './pupil-main/pupil-main.component';
import { PupilSubjectsComponent } from './pupil-subjects/pupil-subjects.component';
import { PupilMarksComponent } from './pupil-marks/pupil-marks.component';
import { PupilAnalyticsComponent } from './pupil-analytics/pupil-analytics.component';

const routes: Routes = [
  {path: 'pupil', component: PupilMainComponent, children: [
    {path: 'subjects', component: PupilSubjectsComponent},
    {path: 'marks/:pupilId/:subjectId', component: PupilMarksComponent},
    {path: 'analytics/:pupilId/:subjectId', component: PupilAnalyticsComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PupilRoutingModule { }
