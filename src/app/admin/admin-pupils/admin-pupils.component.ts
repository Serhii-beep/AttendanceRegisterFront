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
import * as $ from 'jquery';

@Component({
  selector: 'app-admin-pupils',
  templateUrl: './admin-pupils.component.html',
  styleUrls: ['./admin-pupils.component.scss']
})
export class AdminPupilsComponent implements OnInit, AfterViewInit, OnDestroy {
  pupils: Pupil[] = [];
  filteredPupils: Pupil[] = [];
  checkedPupils = [{id: 0, checked: false}];
  pupilsLength = 0;
  pupilsFilter = "";
  pupilsSubscr!: Subscription;
  deletePupilSub!: Subscription;
  displayedColumns: string[] = ['Клас', 'Прізвище', 'Ім\'я', 'По-батькові', 'Пошта', 'Адреса', 'Дата народження'];
  classId!: number;
  page = 0;
  isLoading = true;

  constructor(private pupilsService: PupilsService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute) { }

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
    let classIdStr = this.route.snapshot.queryParamMap.get('class');
    this.classId = parseInt(classIdStr as string);
    this.getPupils();
  }

  getPupils() {
    this.isLoading = true;
    this.pupilsSubscr = this.pupilsService.getAllPupilsPaginated('desc', this.page, 100).subscribe((resp) => {
      if(resp.length > 0) {
        this.pupils = resp;
        if(this.classId) {
          this.pupils = this.pupils.filter(p => p.class.id == this.classId);
        }
        this.filteredPupils = this.pupils;
        this.pupilsLength = this.pupils.length;
        this.checkedPupils = [];
        this.pupils.forEach(p => {
          this.checkedPupils.push({id: p.id, checked: false});
        });
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
    this.getPupils();
  }

  filterPupils() {
    this.filteredPupils = this.pupils.filter(p => p.fullName.toLowerCase().includes(this.pupilsFilter.toLowerCase()));
  }

  sortPupils(order: string) {
    if(!$('.options-wrapper').hasClass('active')) {
      return;
    }
    if(order == 'desc') {
      this.filteredPupils = this.filteredPupils.sort((p1, p2) => p2.fullName.localeCompare(p1.fullName));
    } else {
      this.filteredPupils = this.filteredPupils.sort((p1, p2) => p1.fullName.localeCompare(p2.fullName));
    }
  }

  editPupil(pupil: Pupil) {
    const dialogRef = this.dialog.open(CreatePupilComponent, {
      height: '700px',
      width: '770px',
      panelClass: 'dialog-container'
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
      height: '700px',
      width: '770px',
      panelClass: 'dialog-container'
    });
    dialogRef.componentInstance.resultButtonText = "Додати учня";
    dialogRef.componentInstance.action = "create";
    if(this.classId) {
      dialogRef.componentInstance.pupil.class = this.pupils.filter(p => p.class.id == this.classId)[0].class;
    }
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

  deleteRange() {
    if(this.checkedPupils.filter(p => p.checked).length <= 0) {
      this.snackBar.open("Оберіть учнів, яких потрібно видалити", "Ok");
      return;
    }
    document.querySelector('.alert')?.classList.add("is-visible");
    document.querySelector('.alert-confirm')?.addEventListener("click", (e) => {
      e.preventDefault();
      let deleted = 0
      this.checkedPupils.forEach(p => {
        if(p.checked) {
          this.pupilsService.deletePupil(p.id).subscribe();
          ++deleted;
        }
      })
      this.getPupils();
      this.snackBar.open(`Видалено ${deleted} учнів`, "Ok");
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
