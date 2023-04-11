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
  filteredSubjects!: Subject[];
  subjectSub!: Subscription;
  displayedColumns = ["Предмет", "Вчителі", "Класи"];
  subjectsFilter = "";
  

  constructor(private subjectService: SubjectsService) { }

  ngOnInit(): void {
    this.subjectSub = this.subjectService.getAllSubjects().subscribe((resp) => {
      this.subjects = resp;
      this.filteredSubjects = this.subjects;
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

  filterSubjects() {
    this.filteredSubjects = this.subjects.filter(s => s.name.toLowerCase().includes(this.subjectsFilter.toLowerCase()));
  }

  sortSubjects(order: string) {
    if(!$('.options-wrapper').hasClass('active')) {
      return;
    }
    if(order == 'desc') {
      this.filteredSubjects = this.filteredSubjects.sort((s1, s2) => s2.name.localeCompare(s1.name));
    } else {
      this.filteredSubjects = this.filteredSubjects.sort((s1, s2) => s1.name.localeCompare(s2.name));
    }
  }

  ngOnDestroy(): void {
    if(this.subjectSub) {
      this.subjectSub.unsubscribe();
    }
  }
}
