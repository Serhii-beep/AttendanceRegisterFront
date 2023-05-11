import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClassesService } from 'src/app/admin/services/classes.service';
import { LessonsService } from 'src/app/admin/services/lessons.service';
import { PupilsService } from 'src/app/admin/services/pupils.service';
import { SubjectsService } from 'src/app/admin/services/subjects.service';
import { Class } from 'src/app/dtos/class.dto';
import { LessonInfo } from 'src/app/dtos/lesson-info.dto';
import { Pupil } from 'src/app/dtos/pupil.dto';
import { Section } from 'src/app/dtos/section.dto';
import { Subject } from 'src/app/dtos/subject.dto';
import { MarksService } from '../services/marks.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Mark } from 'src/app/dtos/mark.dto';
import { HttpResponse } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-teacher-marks-all',
  templateUrl: './teacher-marks-all.component.html',
  styleUrls: ['./teacher-marks-all.component.scss']
})
export class TeacherMarksAllComponent implements OnInit, OnDestroy {
  subjectClassId!: number;
  lessons!: LessonInfo[];
  pupils!: Pupil[];
  lessonsSub!: Subscription;
  pupilsSub!: Subscription;
  classSub!: Subscription;
  subjectSub!: Subscription;
  marksSub!: Subscription;
  classModel!: Class;
  sectionModel!: Section;
  subjectModel!: Subject;

  constructor(private route: ActivatedRoute,
    private lessonsService: LessonsService,
    private pupilsService: PupilsService,
    private classService: ClassesService,
    private subjectService: SubjectsService,
    private marksService: MarksService,
    private snackBar: MatSnackBar) { }

  async ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.subjectClassId = parseInt(params.get('subjectClassId') ?? '1');
    });
    while(!this.subjectClassId) {}
    this.lessonsSub = this.marksService.getBySubjectClass(this.subjectClassId).subscribe((resp: LessonInfo[]) => {
      this.lessons = resp;
      this.subjectClassId = this.lessons[0].subjectClassId;
    });
    this.classModel = await this.classService.getBySubjectClass(this.subjectClassId).toPromise();

    this.pupilsSub = this.pupilsService.getByClass(this.classModel.id).subscribe((resp: Pupil[]) => {
      this.pupils = resp;
    });
    this.subjectSub = this.subjectService.getSubjectBySubjectClass(this.subjectClassId).subscribe((resp: Subject) => {
      this.subjectModel = resp;
    });
  }

  getMark(pupilId: number, lessonId: number): Mark {
    let mark = this.lessons.filter(l => l.id == lessonId)[0].marks.find(m => m.pupilId == pupilId);
    if(!mark) {
      mark = {id: 0, lessonId: lessonId, pupilId: pupilId, value: ''};
      this.lessons.filter(l => l.id == lessonId)[0].marks.push(mark);
    }
    return mark;
  }

  generateTerm(term: number) {
    this.marksService.generateTerm(term, this.subjectClassId).subscribe((resp: LessonInfo[]) => {
      this.lessons = resp;
    }, error => this.snackBar.open(error.error, "Ок"));
  }

  downloadExcel() {
    this.marksService.exportToExcel(this.subjectClassId).subscribe((response: HttpResponse<Blob>) => {
      const filename = uuidv4();
      const url = window.URL.createObjectURL(response.body!);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);
    })
  }

  ngOnDestroy(): void {
    if(this.lessonsSub) {
      this.lessonsSub.unsubscribe();
    }
    if(this.pupilsSub) {
      this.pupilsSub.unsubscribe();
    }
    if(this.classSub) {
      this.classSub.unsubscribe();
    }
    if(this.subjectSub) {
      this.subjectSub.unsubscribe();
    }
    if(this.marksSub) {
      this.marksSub.unsubscribe();
    }
  }
}
