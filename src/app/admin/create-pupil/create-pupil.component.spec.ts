import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePupilComponent } from './create-pupil.component';

describe('CreatePupilComponent', () => {
  let component: CreatePupilComponent;
  let fixture: ComponentFixture<CreatePupilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePupilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePupilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
