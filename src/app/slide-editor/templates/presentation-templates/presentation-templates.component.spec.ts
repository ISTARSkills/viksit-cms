import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationTemplatesComponent } from './presentation-templates.component';

describe('PresentationTemplatesComponent', () => {
  let component: PresentationTemplatesComponent;
  let fixture: ComponentFixture<PresentationTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresentationTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentationTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
