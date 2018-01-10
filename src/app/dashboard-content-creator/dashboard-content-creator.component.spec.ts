import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardContentCreatorComponent } from './dashboard-content-creator.component';

describe('DashboardContentCreatorComponent', () => {
  let component: DashboardContentCreatorComponent;
  let fixture: ComponentFixture<DashboardContentCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardContentCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardContentCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
