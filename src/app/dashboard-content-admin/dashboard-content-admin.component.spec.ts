import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardContentAdminComponent } from './dashboard-content-admin.component';

describe('DashboardContentAdminComponent', () => {
  let component: DashboardContentAdminComponent;
  let fixture: ComponentFixture<DashboardContentAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardContentAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardContentAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
