import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClassesService } from 'src/app/admin/services/classes.service';
import { SubjectsService } from 'src/app/admin/services/subjects.service';
import { Class } from 'src/app/dtos/class.dto';
import { Subject } from 'src/app/dtos/subject.dto';
import { SectionsService } from '../services/sections.service';
import { Section } from 'src/app/dtos/section.dto';

@Component({
  selector: 'app-teacher-subject',
  templateUrl: './teacher-subject.component.html',
  styleUrls: ['./teacher-subject.component.scss']
})
export class TeacherSubjectComponent implements OnInit, OnDestroy {
  classId!: number;
  subjectId!: number;
  classModel!: Class;
  subjectModel!: Subject;
  classSub!: Subscription;
  subjectSub!: Subscription;
  sectionSub!: Subscription;
  sections!: Section[];

  constructor(private route: ActivatedRoute,
    private classService: ClassesService,
    private subjectService: SubjectsService,
    private sectionService: SectionsService) { }

  async ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const cl = params.get('classId');
      if(cl) {
        this.classId = parseInt(cl);
      }
      const sub = params.get('subjectId');
      if(sub) {
        this.subjectId = parseInt(sub);
      }
    });

    this.classModel = await this.classService.getById(this.classId).toPromise();

    this.subjectModel = await this.subjectService.getSubjectById(this.subjectId).toPromise();

    this.sections = await this.sectionService.getAll(this.classId, this.subjectId).toPromise();

  }

  expandAccordion(event: Event, sectionId: number) {
    let el = event.target as HTMLElement;
    if(!el.classList.contains('accordion')) {
      el = el.parentElement as HTMLElement;
    }
    console.log(el);
    let panel = el.nextElementSibling as HTMLElement;
    let icon = document.getElementById("icon" + sectionId);
    if(!icon) {
      return;
    }
    if(panel.style.maxHeight) {
      panel.style.maxHeight = '';
      icon.innerHTML = "keyboard_arrow_down";
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
      icon.innerHTML = "keyboard_arrow_up";
    }
  }

  openMarks(event: Event) {
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    if(this.classSub) {
      this.classSub.unsubscribe();
    }
    if(this.subjectSub) {
      this.subjectSub.unsubscribe();
    }
    if(this.sectionSub) {
      this.sectionSub.unsubscribe();
    }
  }

}
