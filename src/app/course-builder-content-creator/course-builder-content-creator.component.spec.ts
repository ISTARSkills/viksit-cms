import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseBuilderContentCreatorComponent } from './course-builder-content-creator.component';

describe('CourseBuilderContentCreatorComponent', () => {
  let component: CourseBuilderContentCreatorComponent;
  let fixture: ComponentFixture<CourseBuilderContentCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseBuilderContentCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseBuilderContentCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
