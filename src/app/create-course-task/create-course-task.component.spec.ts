import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCourseTaskComponent } from './create-course-task.component';

describe('CreateCourseTaskComponent', () => {
  let component: CreateCourseTaskComponent;
  let fixture: ComponentFixture<CreateCourseTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCourseTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCourseTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
