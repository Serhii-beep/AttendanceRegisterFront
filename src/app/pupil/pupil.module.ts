import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PupilRoutingModule } from './pupil-routing.module';
import { PupilMainComponent } from './pupil-main/pupil-main.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { PupilSubjectsComponent } from './pupil-subjects/pupil-subjects.component';
import { PupilMarksComponent } from './pupil-marks/pupil-marks.component';
import { PupilAnalyticsComponent } from './pupil-analytics/pupil-analytics.component';


@NgModule({
  declarations: [
    PupilMainComponent,
    PupilSubjectsComponent,
    PupilMarksComponent,
    PupilAnalyticsComponent
  ],
  imports: [
    CommonModule,
    PupilRoutingModule,
    MatMenuModule,
    MatIconModule
  ]
})
export class PupilModule { }
