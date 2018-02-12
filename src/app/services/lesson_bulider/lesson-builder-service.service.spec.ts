import { TestBed, inject } from '@angular/core/testing';

import { LessonBuilderServiceService } from './lesson-builder-service.service';

describe('LessonBuilderServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LessonBuilderServiceService]
    });
  });

  it('should be created', inject([LessonBuilderServiceService], (service: LessonBuilderServiceService) => {
    expect(service).toBeTruthy();
  }));
});
