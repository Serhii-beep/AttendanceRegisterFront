import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupilSubjectsComponent } from './pupil-subjects.component';

describe('PupilSubjectsComponent', () => {
  let component: PupilSubjectsComponent;
  let fixture: ComponentFixture<PupilSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PupilSubjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PupilSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
