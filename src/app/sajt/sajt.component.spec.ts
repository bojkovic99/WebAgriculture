import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SajtComponent } from './sajt.component';

describe('SajtComponent', () => {
  let component: SajtComponent;
  let fixture: ComponentFixture<SajtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SajtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SajtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
