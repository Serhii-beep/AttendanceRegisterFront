import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { Subscription, merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Pupil } from 'src/app/dtos/pupil.dto';
import { CreatePupilComponent } from '../create-pupil/create-pupil.component';
import { PupilsService } from '../services/pupils.service';

@Component({
  selector: 'app-admin-pupils',
  templateUrl: './admin-pupils.component.html',
  styleUrls: ['./admin-pupils.component.scss']
})
export class AdminPupilsComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoadingResults = true;

  pupils: Pupil[] = [];
  pupilsLength = 0;
  pupilsFilter = "";
  pupilsSubscr!: Subscription;
  deletePupilSub!: Subscription;
  displayedColumns: string[] = ['fullName', 'email', 'class', 'address', 'birthDate', 'delete'];
  classId!: number;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private pupilsService: PupilsService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    let classIdStr = this.route.snapshot.queryParamMap.get('class');
    this.classId = parseInt(classIdStr as string);
    if(this.classId) {
      this.getPupils(this.classId);
    } else {
      this.getPupils();
    }
  }

  getPupils(classId?: number, fullName?: string) {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.pupilsService.getAllPupilsPaginated(this.sort.direction, this.paginator.pageIndex, 30)
          .pipe(catchError(() => observableOf(null)));
      }),
      map(data => {
        this.isLoadingResults = false;
        if(data == null) {
          return [];
        }
        this.pupilsLength = data.length;
        return data;
      })
    ).subscribe(data => {
      this.pupils = data;
      if(classId && classId != -1) {
        this.pupils = this.pupils.filter(p => p.class.id == classId);
      }
      if(fullName) {
        this.pupils = this.pupils.filter(p => p.fullName.toLowerCase().includes(fullName.toLowerCase()));
      }
      this.pupilsLength = this.pupils.length;
    });
  }

  clearFilters() {
    this.classId = -1;
    this.pupilsFilter = "";
    this.getPupils();
  }

  editPupil(pupil: Pupil) {
    const dialogRef = this.dialog.open(CreatePupilComponent, {
      height: '70%',
      width: '75%'
    });
    dialogRef.componentInstance.resultButtonText = "Зберегти";
    dialogRef.componentInstance.pupil = pupil;
    dialogRef.componentInstance.action = "edit";
    dialogRef.afterClosed().subscribe(res => {
      this.getPupils();
      if(res && res == "success") {
        this.snackBar.open("Учня відредаговано", "Ok");
      }
    });
  }

  addPupil(): void {
    const dialogRef = this.dialog.open(CreatePupilComponent, {
      height: '70%',
      width: '75%'
    });
    dialogRef.componentInstance.resultButtonText = "Додати учня";
    dialogRef.componentInstance.action = "create";
    dialogRef.afterClosed().subscribe(res => {
      this.getPupils();
      if(res && res == "success") {
        this.snackBar.open("Учня додано", "Ok");
      }
    });
  }

  deletePupil(id: number): void {
    document.querySelector('.alert')?.classList.add("is-visible");
    document.querySelector('.alert-confirm')?.addEventListener("click", (e) => {
      e.preventDefault();
      this.deletePupilSub = this.pupilsService.deletePupil(id).subscribe((resp) => {
        this.getPupils();
        this.snackBar.open("Учня успішно видалено", "Ok");
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
    if(this.pupilsSubscr) {
      this.pupilsSubscr.unsubscribe();
    }
    if(this.deletePupilSub) {
      this.deletePupilSub.unsubscribe();
    }
  }
}
