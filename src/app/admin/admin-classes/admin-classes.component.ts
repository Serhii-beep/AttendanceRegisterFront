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
  classes!: [{num: number, cl: ClassInfo[]}];
  classesSub!: Subscription;
  profiles!: ClassProfile[];
  profilesSub!: Subscription;
  selectedProfile = "Any";
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

  getAllClasses(): void {
    this.classesSub = this.classesService.getAllClassesIncluded().subscribe((resp) => {
      this.classes = [{num: parseInt(resp[0].name.substring(0, resp[0].name.indexOf('-'))), cl: [resp[0]]}];
      resp.forEach(c => {
        if(c.id == resp[0].id) {
          return;
        }
        const n = parseInt(c.name.substring(0, c.name.indexOf('-')));
        if(this.classes.filter(clas => clas.num == n).length > 0) {
          this.classes.find(clas => clas.num == n)?.cl.push(c);
        } else {
          this.classes.push({num: n, cl: [c]});
        }
      });
      this.classes = this.classes.sort((c1, c2) => c2.num - c1.num);
    }, error => console.log(error));
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
    const dialogRef = this.dialog.open(ManageClassComponent, {
      height: '450px',
      width: '450px',
      panelClass: 'dialog-container'
    });
    dialogRef.componentInstance.class = classs;
    dialogRef.componentInstance.action = "edit";
    dialogRef.componentInstance.btnText = "Зберегти";
    dialogRef.afterClosed().subscribe(res => {
      this.getAllClasses();
      if(res && res == "success") {
        this.snackBar.open("Клас відредаговано", "Ok");
      }
    });
  }

  addClass() {
    const dialogRef = this.dialog.open(ManageClassComponent, {
      height: '450px',
      width: '450px',
      panelClass: 'dialog-container'
    });
    dialogRef.componentInstance.action = "add";
    dialogRef.componentInstance.btnText = "Додати";
    dialogRef.afterClosed().subscribe(res => {
      this.getAllClasses();
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
