import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupilMainComponent } from './pupil-main.component';

describe('PupilMainComponent', () => {
  let component: PupilMainComponent;
  let fixture: ComponentFixture<PupilMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PupilMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PupilMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
