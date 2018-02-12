import { TestBed, inject } from '@angular/core/testing';

import { CourseBuilderServiceService } from './course-builder-service.service';

describe('CourseBuilderServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseBuilderServiceService]
    });
  });

  it('should be created', inject([CourseBuilderServiceService], (service: CourseBuilderServiceService) => {
    expect(service).toBeTruthy();
  }));
});
