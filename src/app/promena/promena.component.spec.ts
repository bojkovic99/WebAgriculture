import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromenaComponent } from './promena.component';

describe('PromenaComponent', () => {
  let component: PromenaComponent;
  let fixture: ComponentFixture<PromenaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromenaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
