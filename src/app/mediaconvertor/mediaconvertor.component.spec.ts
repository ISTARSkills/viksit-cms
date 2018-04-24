import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaconvertorComponent } from './mediaconvertor.component';

describe('MediaconvertorComponent', () => {
  let component: MediaconvertorComponent;
  let fixture: ComponentFixture<MediaconvertorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaconvertorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaconvertorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
