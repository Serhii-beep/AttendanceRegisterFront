import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ClassesService } from 'src/app/admin/services/classes.service';
import { PupilsService } from 'src/app/admin/services/pupils.service';
import { SubjectsService } from 'src/app/admin/services/subjects.service';
import { Class } from 'src/app/dtos/class.dto';
import { LessonInfo } from 'src/app/dtos/lesson-info.dto';
import { Mark } from 'src/app/dtos/mark.dto';
import { Pupil } from 'src/app/dtos/pupil.dto';
import { Subject } from 'src/app/dtos/subject.dto';
import { MarksService } from 'src/app/teacher/services/marks.service';

@Component({
  selector: 'app-pupil-marks',
  templateUrl: './pupil-marks.component.html',
  styleUrls: ['./pupil-marks.component.scss']
})
export class PupilMarksComponent implements OnInit {
  pupilId!: number;
  subjectId!: number;
  lessons!: LessonInfo[];
  pupils!: Pupil[];
  classModel!: Class;
  subjectModel!: Subject;

  constructor(private route: ActivatedRoute,
    private marksService: MarksService,
    private pupilsService: PupilsService,
    private classService: ClassesService,
    private subjectService: SubjectsService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.pupilId = parseInt(params.get('pupilId') ?? '1');
      this.subjectId = parseInt(params.get('subjectId') ?? '1');
    });

    while(!this.pupilId || !this.subjectId) {}

    this.marksService.getByPupilSubject(this.pupilId, this.subjectId).subscribe((resp: LessonInfo[]) => {
      this.lessons = resp;
    });

    this.pupilsService.getAllPupilsPaginated('desc', 0, 100).subscribe((resp: Pupil[]) => {
      let pupilModel = resp.filter(p => p.id === this.pupilId)[0];
      this.pupils = resp.filter(p => p.class.id === pupilModel.class.id);
      this.classModel = pupilModel.class
    });

    this.subjectService.getSubjectById(this.subjectId).subscribe((resp) => {
      this.subjectModel = resp;
    })
  }

  getMark(pupilId: number, lessonId: number): Mark {
    let mark = this.lessons.filter(l => l.id == lessonId)[0].marks.find(m => m.pupilId == pupilId);
    if(!mark) {
      mark = {id: 0, lessonId: lessonId, pupilId: pupilId, value: ''};
      this.lessons.filter(l => l.id == lessonId)[0].marks.push(mark);
    }
    return mark;
  }
}
