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
  pupilsSubscr!: Subscription;
  deletePupilSub!: Subscription;
  displayedColumns: string[] = ['fullName', 'email', 'class', 'address', 'birthDate', 'delete'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private pupilsService: PupilsService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    let classId = this.route.snapshot.queryParamMap.get('class');
    if(classId) {
      this.getPupils(parseInt(classId as string))
    } else {
      this.getPupils();
    }
  }

  getPupils(classId?: number) {
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
      if(classId) {
        this.pupils = this.pupils.filter(p => p.class.id == classId);
        this.pupilsLength = this.pupils.length;
      }
    });
  }

  clearFilters() {
    this.getPupils();
  }

  openAddPupilForm(): void {
    const dialogRef = this.dialog.open(CreatePupilComponent, {
      height: '70%',
      width: '75%'
    });
    dialogRef.afterClosed().subscribe(res => this.getPupils());
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
