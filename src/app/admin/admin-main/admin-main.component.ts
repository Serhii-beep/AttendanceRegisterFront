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

  constructor(private router: Router) {}
  
  ngOnInit(): void {
    let admin = localStorage.getItem('currentUser');
    if(admin) {
      this.currentUser = JSON.parse(admin);
    }
    var tabsNewAnim = $("#navbar-animmenu");
    var activeItemNewAnim = tabsNewAnim.find(".active");
    var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
    var itemPosNewAnimLeft = activeItemNewAnim.position();
    $(".hori-selector").css({
      left: itemPosNewAnimLeft.left + "px",
      width: activeWidthNewAnimWidth + "px"
    });
    $("#navbar-animmenu").on("click", "li", function (e) {
      $("#navbar-animmenu ul li").removeClass("active");
      $(this).addClass("active");
      var activeWidthNewAnimWidth = $(this).innerWidth();
      var itemPosNewAnimLeft = $(this).position();
      $(".hori-selector").css({
        left: itemPosNewAnimLeft.left + "px",
        width: activeWidthNewAnimWidth + "px"
      });
    });
    this.router.events.subscribe((event: Event) => {
      if(event instanceof NavigationEnd) {
        $("#navbar-animmenu ul li").removeClass("active");
        if(event.url.includes("pupils")) {
          var el = $("#pupils");
          el.addClass("active");
          var activeWidthNewAnimWidth = el.innerWidth();
          var itemPosNewAnimLeft = el.position();
          $(".hori-selector").css({
            left: itemPosNewAnimLeft.left + "px",
            width: activeWidthNewAnimWidth + "px"
          });
        } else if(event.url.includes("teachers")) {
          var el = $("#teachers");
          el.addClass("active");
          var activeWidthNewAnimWidth = el.innerWidth();
          var itemPosNewAnimLeft = el.position();
          $(".hori-selector").css({
            left: itemPosNewAnimLeft.left + "px",
            width: activeWidthNewAnimWidth + "px"
          });
        } else if(event.url.includes("classes")) {
          var el = $("#classes");
          el.addClass("active");
          var activeWidthNewAnimWidth = el.innerWidth();
          var itemPosNewAnimLeft = el.position();
          $(".hori-selector").css({
            left: itemPosNewAnimLeft.left + "px",
            width: activeWidthNewAnimWidth + "px"
          });
        }
      }
    })
  }

  logout(): void {
    this.router.navigate(['login']);
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
  }
}
