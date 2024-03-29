import { Component, OnInit } from '@angular/core';
import { Admin } from 'src/app/dtos/admin.dto';
import { Router, Event, NavigationEnd } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.scss']
})
export class AdminMainComponent implements OnInit {
  currentUser!: Admin;

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if(event instanceof NavigationEnd) {
        $('.nav-item').removeClass("active");
        if(event.url.includes('pupils')) {
          $("#pupils").addClass('active');
        } else if(event.url.includes('teachers')) {
          $("#teachers").addClass('active');
        } else if(event.url.includes('classes')) {
          $("#classes").addClass('active');
        } else {
          $("#subjects").addClass('active');
        }
      }
    })
  }
  
  ngOnInit(): void {
    let admin = localStorage.getItem('currentUser');
    if(admin) {
      this.currentUser = JSON.parse(admin);
    }
    $('.nav-item').on('click', function(e) {
      $('.nav-item').removeClass("active");
      $(this).addClass('active');
    });

    
  }

  logout(): void {
    this.router.navigate(['login']);
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
  }
}
