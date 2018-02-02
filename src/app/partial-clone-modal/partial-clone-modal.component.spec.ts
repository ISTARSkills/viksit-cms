import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialCloneModalComponent } from './partial-clone-modal.component';

describe('PartialCloneModalComponent', () => {
  let component: PartialCloneModalComponent;
  let fixture: ComponentFixture<PartialCloneModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartialCloneModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartialCloneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
