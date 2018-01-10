import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonBuilderContentCreatorComponent } from './lesson-builder-content-creator.component';

describe('LessonBuilderContentCreatorComponent', () => {
  let component: LessonBuilderContentCreatorComponent;
  let fixture: ComponentFixture<LessonBuilderContentCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessonBuilderContentCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonBuilderContentCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
