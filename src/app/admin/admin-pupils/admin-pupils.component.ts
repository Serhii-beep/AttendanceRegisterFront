import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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
  displayedColumns: string[] = ['fullName', 'email', 'class', 'address', 'birthDate'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private pupilsService: PupilsService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
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
    });
  }

  openAddPupilForm(): void {
    const dialogRef = this.dialog.open(CreatePupilComponent, {
      height: '70%',
      width: '75%'
    });
  }

  ngOnDestroy(): void {
    if(this.pupilsSubscr) {
      this.pupilsSubscr.unsubscribe();
    }
  }
}
