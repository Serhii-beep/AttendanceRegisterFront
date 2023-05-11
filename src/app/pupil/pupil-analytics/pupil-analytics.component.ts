import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PupilsService } from 'src/app/admin/services/pupils.service';
import { SubjectsService } from 'src/app/admin/services/subjects.service';
import { LessonInfo } from 'src/app/dtos/lesson-info.dto';
import { PupilAnalytics } from 'src/app/dtos/pupil-analytics.dto';
import { Pupil } from 'src/app/dtos/pupil.dto';
import { Subject } from 'src/app/dtos/subject.dto';
import { MarksService } from 'src/app/teacher/services/marks.service';

@Component({
  selector: 'app-pupil-analytics',
  templateUrl: './pupil-analytics.component.html',
  styleUrls: ['./pupil-analytics.component.scss']
})
export class PupilAnalyticsComponent implements OnInit {
  pupilId!: number;
  subjectId!: number;
  pupilModel!: Pupil;
  subjectModel!: Subject;
  pupilAnalytics!: PupilAnalytics[];
  lessons!: LessonInfo[];
  skippedLessons!: PupilAnalytics[];

  constructor(private pupilsServcie: PupilsService,
    private marksService: MarksService,
    private subjectsService: SubjectsService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.pupilId = parseInt(params.get('pupilId')!);
      this.subjectId = parseInt(params.get('subjectId')!);
    });

    while(!this.pupilId || !this.subjectId) {}

    this.pupilsServcie.getAllPupilsPaginated('desc', 0, 100).subscribe((resp) => {
      this.pupilModel = resp.filter(p => p.id === this.pupilId)[0];
    });

    this.subjectsService.getSubjectById(this.subjectId).subscribe((resp) => {
      this.subjectModel = resp;
    });

    this.marksService.getByPupilSubject(this.pupilId, this.subjectId).subscribe((resp) => {
      this.lessons = resp;
      this.pupilAnalytics = [];
      this.skippedLessons = [];
      for(let i = 0; i < this.lessons.length; ++i) {
        let mark = this.lessons[i].marks.filter(m => m.pupilId == this.pupilId)[0];
        let m = Number(mark.value);
        if(m != 0 && !isNaN(m) && !this.lessons[i].isAnnual && !this.lessons[i].isSemester && !this.lessons[i].isFinal) {
          this.pupilAnalytics.push({value: m.toString(), date: this.lessons[i].date});
        }
        if(mark.value === "н") {
          this.skippedLessons.push({value: mark.value, date: this.lessons[i].date});
        }
      }
    });
  }

  getAvg(): number {
    let sum = 0.0;
    for(let i = 0; i < this.pupilAnalytics.length; ++i) {
      sum += Number(this.pupilAnalytics[i].value);
    }
    return parseFloat((sum / this.pupilAnalytics.length).toFixed(2));
  }
}
