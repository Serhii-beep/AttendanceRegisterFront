import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PupilAnalyticsComponent } from './pupil-analytics.component';

describe('PupilAnalyticsComponent', () => {
  let component: PupilAnalyticsComponent;
  let fixture: ComponentFixture<PupilAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PupilAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PupilAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
