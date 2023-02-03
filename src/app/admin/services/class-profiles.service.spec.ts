import { TestBed } from '@angular/core/testing';

import { ClassProfilesService } from './class-profiles.service';

describe('ClassProfilesService', () => {
  let service: ClassProfilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassProfilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
