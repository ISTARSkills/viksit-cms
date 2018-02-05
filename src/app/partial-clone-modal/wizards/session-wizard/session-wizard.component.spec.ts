import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionWizardComponent } from './session-wizard.component';

describe('SessionWizardComponent', () => {
  let component: SessionWizardComponent;
  let fixture: ComponentFixture<SessionWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
