import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RasadnikComponent } from './rasadnik.component';

describe('RasadnikComponent', () => {
  let component: RasadnikComponent;
  let fixture: ComponentFixture<RasadnikComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RasadnikComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RasadnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
