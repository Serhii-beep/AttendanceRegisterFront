import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherMarksAllComponent } from './teacher-marks-all.component';

describe('TeacherMarksAllComponent', () => {
  let component: TeacherMarksAllComponent;
  let fixture: ComponentFixture<TeacherMarksAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherMarksAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherMarksAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
