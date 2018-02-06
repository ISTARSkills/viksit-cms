import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentAdminReviewTaskComponent } from './content-admin-review-task.component';

describe('ContentAdminReviewTaskComponent', () => {
  let component: ContentAdminReviewTaskComponent;
  let fixture: ComponentFixture<ContentAdminReviewTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentAdminReviewTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentAdminReviewTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
