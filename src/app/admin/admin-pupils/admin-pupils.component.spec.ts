import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPupilsComponent } from './admin-pupils.component';

describe('AdminPupilsComponent', () => {
  let component: AdminPupilsComponent;
  let fixture: ComponentFixture<AdminPupilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPupilsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPupilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
