import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialCourseListItemComponent } from './partial-course-list-item.component';

describe('PartialCourseListItemComponent', () => {
  let component: PartialCourseListItemComponent;
  let fixture: ComponentFixture<PartialCourseListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartialCourseListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartialCourseListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
