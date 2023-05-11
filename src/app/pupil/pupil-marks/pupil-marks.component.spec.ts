import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupilMarksComponent } from './pupil-marks.component';

describe('PupilMarksComponent', () => {
  let component: PupilMarksComponent;
  let fixture: ComponentFixture<PupilMarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PupilMarksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PupilMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
