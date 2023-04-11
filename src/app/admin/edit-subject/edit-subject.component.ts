import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { SubjectsService } from '../services/subjects.service';
import { Subject } from '../../dtos/subject.dto';
import { Subscription } from 'rxjs';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Class } from 'src/app/dtos/class.dto';
import { ClassesService } from '../services/classes.service';
import { Teacher } from 'src/app/dtos/teacher.dto';
import { TeachersService } from '../services/teachers.service';

import * as $ from 'jquery';

@Component({
  selector: 'app-edit-subject',
  templateUrl: './edit-subject.component.html',
  styleUrls: ['./edit-subject.component.scss']
})
export class EditSubjectComponent implements OnInit, OnDestroy {

  subject!: Subject;
  subjectSub!: Subscription;
  allClasses!: Class[];
  allClassesSub!: Subscription;
  inputClass = "";
  suggestionClass = "";
  allTeachers!: Teacher[];
  allTeachersSub!: Subscription;
  inputTeacher = "";
  suggestionTeacher = "";

  constructor(private subjectService: SubjectsService,
    private classService: ClassesService,
    private teachersService: TeachersService,
    private route: ActivatedRoute) { }

  async ngOnInit() {
    let id: string | null = '';
    this.route.paramMap.subscribe((params) => {
      id = params.get('id');
    });
    if(id) {
      this.subjectSub = this.subjectService.getSubjectById(parseInt(id)).subscribe((resp: Subject) => {
        this.subject = resp;
      });
      this.allClassesSub = this.classService.getAllClasses().subscribe((resp: Class[]) => {
        this.allClasses = resp;
      });
      this.allTeachersSub = this.teachersService.getAllteachersPaginated('desc', 0, 100).subscribe((resp: Teacher[]) => {
        this.allTeachers = resp;
      })
    }
  }

  inputClassHandler() {
    this.clearSuggestionClass();
    let regex = new RegExp("^" + this.inputClass, "i");
    for(let i = 0; i < this.allClasses.length; ++i) {
      if(regex.test(this.allClasses[i].name) && this.inputClass != "") {
        this.suggestionClass = this.allClasses[i].name;
        break;
      }
    }
    $(".error-classes").css('opacity', '0');
  }

  inputTeacherHandler() {
    this.clearSuggestionTeacher();
    let regex = new RegExp("^" + this.inputTeacher, "i");
    for(let i = 0; i < this.allTeachers.length; ++i) {
      if(regex.test(this.allTeachers[i].fullName) && this.inputTeacher != "") {
        this.suggestionTeacher = this.allTeachers[i].fullName;
        break;
      }
    }
    $(".error-teachers").css('opacity', '0');
  }

  completePredictionClass(e: KeyboardEvent) {
    if(e.key == "Enter" || e.key == "Tab") {
      e.preventDefault();
      this.inputClass = this.suggestionClass;
      this.clearSuggestionClass();
    }
  }

  completePredictionTeacher(e: KeyboardEvent) {
    if(e.key == "Enter" || e.key == "Tab") {
      e.preventDefault();
      this.inputTeacher = this.suggestionTeacher;
      this.clearSuggestionTeacher();
    }
  }

  clearSuggestionClass() {
    this.suggestionClass = "";
  }

  clearSuggestionTeacher() {
    this.suggestionTeacher = "";
  }

  updateSubject() {
    this.subjectSub = this.subjectService.updateSubjectTeachersClasses(this.subject).subscribe((resp) => {
      this.subject = resp;
    });
  }

  addTeacher() {
    const teacher = this.allTeachers.filter(t => t.fullName == this.inputTeacher);
    if(teacher.length == 0) {
      $('.error-teachers').css('opacity', '1');
      return;
    }
    this.subject.teachers.push(teacher[0]);
    this.updateSubject();
    this.inputTeacher = "";
    this.suggestionTeacher = "";
  }

  addClass() {
    const classs = this.allClasses.filter(c => c.name == this.inputClass);
    if(classs.length == 0) {
      $('.error-classes').css('opacity', '1');
      return;
    }
    this.subject.classes.push(classs[0]);
    this.updateSubject();
    this.inputClass = "";
    this.suggestionClass = "";
  }

  deleteTeacher(id: number) {
    this.subject.teachers = this.subject.teachers.filter(t => t.id != id);
    this.updateSubject();
  }

  deleteClass(id: number) {
    this.subject.classes = this.subject.classes.filter(c => c.id != id);
    this.updateSubject();
  }

  ngOnDestroy(): void {
    this.subjectSub = this.subjectService.updateSubjectTeachersClasses(this.subject).subscribe((resp) => {
      this.subject = resp;
      console.log(resp);
    });
    if(this.subjectSub) {
      this.subjectSub.unsubscribe();
    }
    if(this.allClassesSub) {
      this.allClassesSub.unsubscribe();
    }
    if(this.allTeachersSub) {
      this.allClassesSub.unsubscribe();
    }
  }

}
