import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClassProfilesService } from 'src/app/admin/services/class-profiles.service';
import { ClassesService } from 'src/app/admin/services/classes.service';
import { SubjectsService } from 'src/app/admin/services/subjects.service';
import { ClassInfo } from 'src/app/dtos/classInfo.dto';
import { ClassProfile } from 'src/app/dtos/classProfile.dto';
import { Subject } from 'src/app/dtos/subject.dto';
import { Teacher } from 'src/app/dtos/teacher.dto';

@Component({
  selector: 'app-teacher-classes',
  templateUrl: './teacher-classes.component.html',
  styleUrls: ['./teacher-classes.component.scss']
})
export class TeacherClassesComponent implements OnInit, OnDestroy {
  sortDirection = ''
  classes!: [{num: number, cl: ClassInfo[]}];
  profiles!: ClassProfile[];
  classesSub!: Subscription;
  teacherModel!: Teacher;
  selectedClassId = -1;
  subjects!: Subject[];
  subjectsSub!: Subscription;
  
  constructor(private classesService: ClassesService,
    private classProfileService: ClassProfilesService,
    private subjectService: SubjectsService) { }

  ngOnInit(): void {
    const teacher = localStorage.getItem('currentUser');
    if(teacher) {
      this.teacherModel = JSON.parse(teacher);
    }
    this.getAllClasses();
  }

  getAllClasses() {
    this.classesSub = this.classesService.getByTeacher(this.teacherModel.id).subscribe((resp) => {
      this.classes = [{num: parseInt(resp[0].name.substring(0, resp[0].name.indexOf('-'))), cl: [resp[0]]}];
      resp.forEach(c => {
        if(c.id == resp[0].id) {
          return;
        }
        const n = parseInt(c.name.substring(0, c.name.indexOf('-')));
        if(this.classes.filter(clas => clas.num == n).length > 0) {
          this.classes.find(clas => clas.num == n)?.cl.push(c);
        } else {
          this.classes.push({num: n, cl: [c]});
        }
      });
      this.classes = this.classes.sort((c1, c2) => c2.num - c1.num);
    }, error => console.log(error));
  }

  selectClass(id: number) {
    this.selectedClassId = id;
    this.subjectsSub = this.subjectService.getAllSubjects().subscribe((resp: Subject[]) => {
      this.subjects = resp.filter(s => s.teachers.find(t => t.id == this.teacherModel.id)
        && s.classes.find(c => c.id == id));
    })
  }

  ngOnDestroy(): void {
    if(this.classesSub) {
      this.classesSub.unsubscribe();
    }
    if(this.subjectsSub) {
      this.subjectsSub.unsubscribe();
    }
  }
}
