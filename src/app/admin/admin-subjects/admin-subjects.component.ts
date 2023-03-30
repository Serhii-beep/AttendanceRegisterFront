import { Component, OnInit } from '@angular/core';
import { Subject } from 'src/app/dtos/subject.dto';
import { SubjectsService } from '../services/subjects.service';

@Component({
  selector: 'app-admin-subjects',
  templateUrl: './admin-subjects.component.html',
  styleUrls: ['./admin-subjects.component.scss']
})
export class AdminSubjectsComponent implements OnInit {
  subjects!: Subject[];
  

  constructor(private subjectService: SubjectsService) { }

  ngOnInit(): void {

  }
}
