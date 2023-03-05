import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Class } from 'src/app/dtos/class.dto';
import { ClassInfo } from 'src/app/dtos/classInfo.dto';
import { ClassProfile } from 'src/app/dtos/classProfile.dto';
import { ManageClassComponent } from '../manage-class/manage-class.component';
import { ClassProfilesService } from '../services/class-profiles.service';
import { ClassesService } from '../services/classes.service';

@Component({
  selector: 'app-admin-classes',
  templateUrl: './admin-classes.component.html',
  styleUrls: ['./admin-classes.component.scss']
})
export class AdminClassesComponent implements OnInit, OnDestroy {
  classes!: ClassInfo[];
  classesSub!: Subscription;
  profiles!: ClassProfile[];
  profilesSub!: Subscription;
  selectedProfile = "Any";
  filterClass!: string;
  filteredClasses!: ClassInfo[];
  delClassSub!: Subscription;

  constructor(private classesService: ClassesService,
    private profilesService: ClassProfilesService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllClasses();
    this.profilesSub = this.profilesService.getAll().subscribe((resp) => {
      this.profiles = resp;
    }, error => console.log(error));
  }

  getAllClasses() {
    this.classesSub = this.classesService.getAllClassesIncluded().subscribe((resp) => {
      this.classes = resp;
      this.filteredClasses = resp;
    }, error => console.log(error));
  }

  filter() {
    if(this.filterClass && this.selectedProfile && this.selectedProfile !== "Any") {
      this.filteredClasses = this.classes.filter(c => c.name.includes(this.filterClass)).filter(c => 
        c.profileName === this.selectedProfile);
    } else if(this.filterClass) {
      this.filteredClasses = this.classes.filter(c => c.name.includes(this.filterClass));
    } else if(this.selectedProfile && this.selectedProfile !== "Any") {
      this.filteredClasses = this.classes.filter(c => c.profileName === this.selectedProfile);
    } else {
      this.filteredClasses = this.classes;
    }
  }

  openPupils(classId: number) {
    this.router.navigate(['admin/pupils'], { queryParams: {class: classId} });
  }

  deleteClass(e: Event, classId: number) {
    e.stopPropagation();
    document.querySelector('.alert')?.classList.add("is-visible");
    document.querySelector('.alert-confirm')?.addEventListener("click", (e) => {
      e.preventDefault();
      this.delClassSub = this.classesService.deleteClassById(classId).subscribe((resp) => {
        this.getAllClasses();
        this.filter();
        this.snackBar.open("Клас видалено", "Ok");
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

  editClass(e: Event, classs: ClassInfo) {
    e.stopPropagation();
    const dialogRef = this.dialog.open(ManageClassComponent);
    dialogRef.componentInstance.class = classs;
    dialogRef.componentInstance.action = "edit";
    dialogRef.componentInstance.btnText = "Зберегти";
    dialogRef.afterClosed().subscribe(res => {
      this.getAllClasses();
      this.filter();
      if(res && res == "success") {
        this.snackBar.open("Клас відредаговано", "Ok");
      }
    });
  }

  addClass() {
    const dialogRef = this.dialog.open(ManageClassComponent);
    dialogRef.componentInstance.action = "add";
    dialogRef.componentInstance.btnText = "Додати";
    dialogRef.afterClosed().subscribe(res => {
      this.getAllClasses();
      this.filter();
      if(res && res == "success") {
        this.snackBar.open("Клас додано", "Ok");
      }
    })
  }

  ngOnDestroy(): void {
    if(this.classesSub) {
      this.classesSub.unsubscribe();
    }
    if(this.profilesSub) {
      this.profilesSub.unsubscribe();
    }
    if(this.delClassSub) {
      this.delClassSub.unsubscribe();
    }
  }

}
