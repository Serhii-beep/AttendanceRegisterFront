import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Teacher } from 'src/app/dtos/teacher.dto';

@Component({
  selector: 'app-teacher-main',
  templateUrl: './teacher-main.component.html',
  styleUrls: ['./teacher-main.component.scss']
})
export class TeacherMainComponent implements OnInit {
  currentUser!: Teacher;

  constructor(private router: Router) { }

  ngOnInit(): void {
    let teacher = localStorage.getItem('currentUser');
    if(teacher) {
      this.currentUser = JSON.parse(teacher);
    }
  }

  logout(): void {
    this.router.navigate(['login']);
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
  }
}
