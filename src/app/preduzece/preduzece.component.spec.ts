import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreduzeceComponent } from './preduzece.component';

describe('PreduzeceComponent', () => {
  let component: PreduzeceComponent;
  let fixture: ComponentFixture<PreduzeceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreduzeceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreduzeceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
