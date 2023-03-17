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

@Component({
  selector: 'app-admin-teachers',
  templateUrl: './admin-teachers.component.html',
  styleUrls: ['./admin-teachers.component.scss']
})
export class AdminTeachersComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoadingResults = true;

  teachers: Teacher[] = [];
  teachersLength = 0;
  teachersSub!: Subscription;
  displayedColumns = ['fullName', 'email', 'delete'];
  teachersFilter = "";
  deleteTeacherSub!: Subscription;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private teacherService: TeachersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.getTeachers();
  }

  getTeachers(fullName?: string) {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.teacherService.getAllteachersPaginated(this.sort.direction, this.paginator.pageIndex, 30)
          .pipe(catchError(() => observableOf(null)));
      }),
      map(data => {
        this.isLoadingResults = false;
        if(data == null) {
          return [];
        }
        this.teachersLength = data.length;
        return data;
      })
    ).subscribe(data => {
      this.teachers = data;
      if(fullName) {
        this.teachers = this.teachers.filter(t => t.fullName.toLowerCase().includes(fullName.toLocaleLowerCase()));
      }
      this.teachersLength = this.teachers.length;
    })
  }

  clearFilters() {
    this.teachersFilter = "";
    this.getTeachers();
  }

  addTeacher() {
    const dialogRef = this.dialog.open(ManageTeacherComponent, {
      height: '70%',
      width: '75%'
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
      height: '70%',
      width: '75%'
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

  ngOnDestroy(): void {
    if(this.teachersSub) {
      this.teachersSub.unsubscribe();
    }
    if(this.deleteTeacherSub) {
      this.deleteTeacherSub.unsubscribe();
    }
  }
}
