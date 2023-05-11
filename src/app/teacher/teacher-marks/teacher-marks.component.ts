import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClassesService } from 'src/app/admin/services/classes.service';
import { LessonsService } from 'src/app/admin/services/lessons.service';
import { PupilsService } from 'src/app/admin/services/pupils.service';
import { LessonInfo } from 'src/app/dtos/lesson-info.dto';
import { Mark } from 'src/app/dtos/mark.dto';
import { Pupil } from 'src/app/dtos/pupil.dto';
import { SectionsService } from '../services/sections.service';
import { Class } from 'src/app/dtos/class.dto';
import { Section } from 'src/app/dtos/section.dto';
import { Subject } from 'src/app/dtos/subject.dto';
import { SubjectsService } from 'src/app/admin/services/subjects.service';
import { MarksService } from '../services/marks.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-teacher-marks',
  templateUrl: './teacher-marks.component.html',
  styleUrls: ['./teacher-marks.component.scss']
})
export class TeacherMarksComponent implements OnInit, OnDestroy {
  sectionId!: number;
  classId!: number;
  subjectId!: number;
  lessons!: LessonInfo[];
  pupils!: Pupil[];
  lessonsSub!: Subscription;
  pupilsSub!: Subscription;
  classSub!: Subscription;
  sectionSub!: Subscription;
  subjectSub!: Subscription;
  marksSub!: Subscription;
  classModel!: Class;
  sectionModel!: Section;
  subjectModel!: Subject;
  newLessonModel!: LessonInfo;
  subjectClassId!: number;

  constructor(private route: ActivatedRoute,
    private lessonsService: LessonsService,
    private pupilsService: PupilsService,
    private classService: ClassesService,
    private sectionsService: SectionsService,
    private subjectService: SubjectsService,
    private marksService: MarksService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.sectionId = parseInt(params.get('sectionId') ?? '1');
      this.classId = parseInt(params.get('classId') ?? '1');
      this.subjectId = parseInt(params.get('subjectId') ?? '1');
    });
    while(!this.sectionId || !this.classId || !this.subjectId) {}
    this.lessonsSub = this.lessonsService.getLessonsBySection(this.sectionId).subscribe((resp: LessonInfo[]) => {
      this.lessons = resp;
      this.subjectClassId = this.lessons[0].subjectClassId;
      this.newLessonModel = { id: 0, subjectClassId: this.subjectClassId, theme: '', date: new Date(), isFinal: false, isSemester: false, isAnnual: false, sectionId: this.sectionId, marks: [] };
    });
    this.pupilsSub = this.pupilsService.getByClass(this.classId).subscribe((resp: Pupil[]) => {
      this.pupils = resp;
    });
    this.classSub = this.classService.getById(this.classId).subscribe((resp: Class) => {
      this.classModel = resp;
    });
    this.sectionSub = this.sectionsService.getAll(this.classId, this.subjectId).subscribe((resp: Section[]) => {
      this.sectionModel = resp.filter(s => s.id == this.sectionId)[0];
    });
    this.subjectSub = this.subjectService.getSubjectById(this.subjectId).subscribe((resp: Subject) => {
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

  onKeyDownThemesDates(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    let next: HTMLElement;

    switch(event.key) {
      case 'ArrowRight':
        next = target.nextElementSibling as HTMLElement;
        break;
      case 'ArrowLeft':
        next = target.previousElementSibling as HTMLElement;
        break;
      default:
        return;
    }
    event.preventDefault();
    next.focus();
  }

  onKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const parent = target.parentElement as HTMLElement;
    const row = parent.parentElement as HTMLElement;
    let next: HTMLElement | null = null;
    switch(event.key) {
      case 'ArrowLeft':
        next = parent.previousElementSibling as HTMLElement;
        break;
      case 'ArrowRight':
        next = parent.nextElementSibling as HTMLElement;
        break;
      case 'ArrowUp':
        next = row.previousElementSibling?.querySelector('.cell') as HTMLElement
        break;
      case 'ArrowDown':
        next = row.nextElementSibling?.querySelector('.cell') as HTMLElement;
        break;
      default:
        return;
    }
    event.preventDefault();
    next?.querySelector('input')?.focus();
  }

  validateInputMark(event: Event, pupilId: number, lessonId: number) {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if(value === 'н') {
      return;
    }

    const number = parseInt(value, 10);

    if(isNaN(number) || number < 1 || number > 12) {
      target.value = '';
    }
  }

  saveTheme(event: KeyboardEvent) {
    event.preventDefault();
    if(event.key === "Enter" && this.newLessonModel.theme) {
      this.lessons.push(this.newLessonModel);
      this.newLessonModel = { id: 0, subjectClassId: this.subjectClassId, theme: '', date: new Date(), isFinal: false, isSemester: false, isAnnual: false, sectionId: this.sectionId, marks: [] };
      this.saveMarks();
      const target = event.target as HTMLDivElement;
      target.textContent = '';
    }
  }

  themeInput(to: LessonInfo, event: Event) {
    const target = event.target as HTMLDivElement;
    to.theme = target.textContent ?? '';
  }

  saveMarks() {
    this.marksSub = this.marksService.updateMarks(this.lessons).subscribe((resp: LessonInfo[]) => {
      this.lessons = resp;
      this.snackBar.open('Збережено', 'Ок');
    }, error => console.log(error));
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
    if(this.sectionSub) {
      this.sectionSub.unsubscribe();
    }
    if(this.subjectSub) {
      this.subjectSub.unsubscribe();
    }
    if(this.marksSub) {
      this.marksSub.unsubscribe();
    }
  }
}
