import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'src/app/dtos/subject.dto';
import { SubjectsService } from '../services/subjects.service';
import { Subscription } from 'rxjs';
import * as $ from 'jquery';

@Component({
  selector: 'app-admin-subjects',
  templateUrl: './admin-subjects.component.html',
  styleUrls: ['./admin-subjects.component.scss']
})
export class AdminSubjectsComponent implements OnInit, OnDestroy {
  subjects!: Subject[];
  subjectSub!: Subscription;
  displayedColumns = ["Предмет", "Вчителі", "Класи"];
  

  constructor(private subjectService: SubjectsService) { }

  ngOnInit(): void {
    this.subjectSub = this.subjectService.getAllSubjects().subscribe((resp) => {
      this.subjects = resp;
      console.log(resp);
    }, error => console.log(error));

    $(".dropdown").on("mouseenter", function() {
      $(".options-wrapper").addClass("active");
    });

    $(".dropdown").on("mouseout", function(e) {
      if(!$(e.relatedTarget!).hasClass("options-wrapper")) {
        $(".options-wrapper").removeClass("active");
      }
    });

    $(".options-wrapper").on("mouseleave", function() {
      $(".options-wrapper").removeClass("active");
    });

    $(".option").on("mouseover", function() {
      if($(".options-wrapper").hasClass("active")) {
        $(".option").css('cursor', 'pointer');
        $(".arrow_icon", this).addClass("active");
      } else {
        $(".option").css('cursor', 'default');
      }
    });

    $(".option").on("mouseout", function() {
      $(".arrow_icon").removeClass("active");
    });
  }

  ngOnDestroy(): void {
    if(this.subjectSub) {
      this.subjectSub.unsubscribe();
    }
  }
}
