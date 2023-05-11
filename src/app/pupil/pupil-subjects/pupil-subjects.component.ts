import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SubjectsService } from 'src/app/admin/services/subjects.service';
import { Pupil } from 'src/app/dtos/pupil.dto';
import { Subject } from 'src/app/dtos/subject.dto';

@Component({
  selector: 'app-pupil-subjects',
  templateUrl: './pupil-subjects.component.html',
  styleUrls: ['./pupil-subjects.component.scss']
})
export class PupilSubjectsComponent implements OnInit, OnDestroy {
  subjects!: Subject[];
  subjectSub!: Subscription;
  pupilModel!: Pupil;

  constructor(private subjectsService: SubjectsService) { }

  ngOnInit(): void {
    const pupil = localStorage.getItem('currentUser');
    if(pupil) {
      this.pupilModel = JSON.parse(pupil);
    }
    this.getAllSubjects();
  }

  getAllSubjects() {
    this.subjectSub = this.subjectsService.getSubjectsByPupil(this.pupilModel.id).subscribe((resp) => {
      this.subjects = resp;
    })
  }

  ngOnDestroy(): void {
    if(this.subjectSub) {
      this.subjectSub.unsubscribe();
    }
  }
}
