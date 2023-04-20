import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'src/app/dtos/subject.dto';
import { SubjectsService } from '../services/subjects.service';
import { Subscription } from 'rxjs';
import * as $ from 'jquery';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CreateSubjectComponent } from '../create-subject/create-subject.component';

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
  delSubjectSub!: Subscription;

  constructor(private subjectService: SubjectsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllSubjects();

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

  getAllSubjects() {
    this.subjectSub = this.subjectService.getAllSubjects().subscribe((resp) => {
      this.subjects = resp;
      this.filteredSubjects = this.subjects;
    }, error => console.log(error));
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

  addSubject() {
    const dialogRef = this.dialog.open(CreateSubjectComponent, {
      height: '300px',
      width: '450px',
      panelClass: 'dialog-container'
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getAllSubjects();
      if(res && res == "success") {
        this.snackBar.open("Предмет додано", "Ok");
      }
    })
  }

  deleteSubject(e: Event, subjectId: number) {
    e.stopPropagation();
    document.querySelector('.alert')?.classList.add("is-visible");
    document.querySelector('.alert-confirm')?.addEventListener("click", (e) => {
      e.preventDefault();
      this.delSubjectSub = this.subjectService.deleteSubject(subjectId).subscribe((resp) => {
        this.getAllSubjects();
        this.snackBar.open("Предмет видалено", "Ok");
      }, error => console.log(error));
      document.querySelector('.alert')?.classList.remove("is-visible");
    });
    document.querySelector('.alert-cancel')?.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector('.alert')?.classList.remove("is-visible");
    });
    document.querySelector('.alert-close')?.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector('.alert')?.classList.remove("is-visible");
    });
    document.addEventListener("keyup", (event) => {
      let e = <KeyboardEvent> event;
      if(e.key == "Escape") {
        document.querySelector('.alert')?.classList.remove("is-visible");
      }
    });
  }

  ngOnDestroy(): void {
    if(this.subjectSub) {
      this.subjectSub.unsubscribe();
    }
    if(this.delSubjectSub) {
      this.delSubjectSub.unsubscribe();
    }
  }
}
