import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleWizardComponent } from './module-wizard.component';

describe('ModuleWizardComponent', () => {
  let component: ModuleWizardComponent;
  let fixture: ComponentFixture<ModuleWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
