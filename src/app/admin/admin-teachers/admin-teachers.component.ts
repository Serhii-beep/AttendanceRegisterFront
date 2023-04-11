import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { Subscription, merge, of as observableOf } from 'rxjs';
import { startWith, switchMap, catchError, map } from 'rxjs/operators';
import { Teacher } from 'src/app/dtos/teacher.dto';
import { ManageTeacherComponent } from '../manage-teacher/manage-teacher.component';
import { TeachersService } from '../services/teachers.service';

import * as $ from 'jquery';

@Component({
  selector: 'app-admin-teachers',
  templateUrl: './admin-teachers.component.html',
  styleUrls: ['./admin-teachers.component.scss']
})
export class AdminTeachersComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = true;

  teachers: Teacher[] = [];
  teachersLength = 0;
  teachersSub!: Subscription;
  displayedColumns = ['Прізвище', 'Ім\'я', 'По-батькові', 'Пошта'];
  teachersFilter = "";
  checkedTeachers = [{id: 0, checked: false}];
  deleteTeacherSub!: Subscription;
  page = 0;
  filteredTeachers: Teacher[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private teacherService: TeachersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
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

  ngAfterViewInit(): void {
    this.getTeachers();
  }

  getTeachers(fullName?: string) {
    this.isLoading = true;
    this.teachersSub = this.teacherService.getAllteachersPaginated('desc', this.page, 30).subscribe((resp) => {
      if(resp.length > 0) {
        this.teachers = resp;
        this.filteredTeachers = this.teachers;
        this.teachersLength = this.teachers.length;
        this.checkedTeachers = [];
        this.teachers.forEach(t => {
          this.checkedTeachers.push({id: t.id, checked: false});
        })
      } else {
        this.page--;
      }
      this.isLoading = false;
    });
  }

  getPage(p: number) {
    if(p < 0) {
      return;
    }
    this.page = p;
    this.getTeachers();
  }

  filterTeachers() {
    this.filteredTeachers = this.teachers.filter(t => t.fullName.toLowerCase().includes(this.teachersFilter.toLowerCase()));
  }

  sortTeachers(order: string) {
    if(!$('.options-wrapper').hasClass('active')) {
      return;
    }
    if(order == 'desc') {
      this.filteredTeachers = this.filteredTeachers.sort((t1, t2) => t2.fullName.localeCompare(t1.fullName));
    } else {
      this.filteredTeachers = this.filteredTeachers.sort((t1, t2) => t1.fullName.localeCompare(t2.fullName));
    }
  }

  addTeacher() {
    const dialogRef = this.dialog.open(ManageTeacherComponent, {
      height: '700px',
      width: '770px',
      panelClass: 'dialog-container'
    });
    dialogRef.componentInstance.resultButtonText = "Додати вчителя";
    dialogRef.componentInstance.action = "create";
    dialogRef.afterClosed().subscribe(res => {
      this.getTeachers();
      if(res && res == "success") {
        this.snackBar.open("Вчителя додано", "Ok");
      }
    });
  }

  editTeacher(teacher: Teacher) {
    const dialogRef = this.dialog.open(ManageTeacherComponent, {
      height: '700px',
      width: '770px',
      panelClass: 'dialog-container'
    });
    dialogRef.componentInstance.resultButtonText = "Зберегти";
    dialogRef.componentInstance.teacher = teacher;
    dialogRef.componentInstance.action = "edit";
    dialogRef.afterClosed().subscribe(res => {
      this.getTeachers();
      if(res && res == "success") {
        this.snackBar.open("Вчителя відредаговано", "Ok");
      }
    });
  }

  deleteTeacher(id: number) {
    document.querySelector('.alert')?.classList.add("is-visible");
    document.querySelector('.alert-confirm')?.addEventListener("click", (e) => {
      e.preventDefault();
      this.deleteTeacherSub = this.teacherService.deleteTeacher(id).subscribe((resp) => {
        this.getTeachers();
        this.snackBar.open("Вчителя успішно видалено", "Ok");
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

  deleteRange() {
    if(this.checkedTeachers.filter(t => t.checked).length <= 0) {
      this.snackBar.open("Оберіть вчителів, яких потрібно видалити", "Ok");
      return;
    }
    document.querySelector('.alert')?.classList.add("is-visible");
    document.querySelector('.alert-confirm')?.addEventListener("click", (e) => {
      e.preventDefault();
      let deleted = 0
      this.checkedTeachers.forEach(t => {
        if(t.checked) {
          this.teacherService.deleteTeacher(t.id).subscribe();
          ++deleted;
        }
      })
      this.getTeachers();
      this.snackBar.open(`Видалено ${deleted} вчителів`, "Ok");
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
    if(this.teachersSub) {
      this.teachersSub.unsubscribe();
    }
    if(this.deleteTeacherSub) {
      this.deleteTeacherSub.unsubscribe();
    }
  }
}
