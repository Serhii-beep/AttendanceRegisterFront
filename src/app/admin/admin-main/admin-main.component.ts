import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Admin } from 'src/app/dtos/admin.dto';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.scss']
})
export class AdminMainComponent implements OnInit {
  currentUser!: Admin;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
    private router: Router) {}
  
  ngOnInit(): void {
    let admin = localStorage.getItem('currentUser');
    if(admin) {
      this.currentUser = JSON.parse(admin);
    }
    var tabsNewAnim = $('#navbar-animmenu');
		var selectorNewAnim = $('#navbar-animmenu').find('li').length;
		//var selectorNewAnim = $(".tabs").find(".selector");
		var activeItemNewAnim = tabsNewAnim.find('.active');
		var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
		var itemPosNewAnimLeft = activeItemNewAnim.position();
		$(".hori-selector").css({
			"left":itemPosNewAnimLeft.left + "px",
			"width": activeWidthNewAnimWidth + "px"
		});
		$("#navbar-animmenu").on("click","li",() =>{
			$('#navbar-animmenu ul li').removeClass("active");
			$(this).addClass('active');
			var activeWidthNewAnimWidth = $(this).innerWidth();
			var itemPosNewAnimLeft = $(this).position();
			$(".hori-selector").css({
				"left":itemPosNewAnimLeft.left + "px",
				"width": activeWidthNewAnimWidth + "px"
			});
		});
  }

  logout(): void {
    this.router.navigate(['login']);
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
  }
}
