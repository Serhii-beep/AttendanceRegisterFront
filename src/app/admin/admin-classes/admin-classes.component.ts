import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClassInfo } from 'src/app/dtos/classInfo.dto';
import { ClassProfile } from 'src/app/dtos/classProfile.dto';
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

  constructor(private classesService: ClassesService,
    private profilesService: ClassProfilesService,
    private router: Router) { }

  ngOnInit(): void {
    this.classesSub = this.classesService.getAllClassesIncluded().subscribe((resp) => {
      this.classes = resp;
      this.filteredClasses = resp;
    }, error => console.log(error));
    this.profilesSub = this.profilesService.getAll().subscribe((resp) => {
      this.profiles = resp;
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

  ngOnDestroy(): void {
    if(this.classesSub) {
      this.classesSub.unsubscribe();
    }
    if(this.profilesSub) {
      this.profilesSub.unsubscribe();
    }
  }

}
