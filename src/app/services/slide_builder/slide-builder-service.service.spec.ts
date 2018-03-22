import { TestBed, inject } from '@angular/core/testing';

import { SlideBuilderServiceService } from './slide-builder-service.service';

describe('SlideBuilderServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SlideBuilderServiceService]
    });
  });

  it('should be created', inject([SlideBuilderServiceService], (service: SlideBuilderServiceService) => {
    expect(service).toBeTruthy();
  }));
});
