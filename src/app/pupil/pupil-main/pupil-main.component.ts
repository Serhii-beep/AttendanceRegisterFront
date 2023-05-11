import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pupil } from 'src/app/dtos/pupil.dto';

@Component({
  selector: 'app-pupil-main',
  templateUrl: './pupil-main.component.html',
  styleUrls: ['./pupil-main.component.scss']
})
export class PupilMainComponent implements OnInit {

  currentUser!: Pupil;

  constructor(private router: Router) { }

  ngOnInit(): void {
    let pupil = localStorage.getItem('currentUser');
    if(pupil) {
      this.currentUser = JSON.parse(pupil);
    }
  }

  logout(): void {
    this.router.navigate(['login']);
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
  }
}
