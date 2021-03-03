import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoljoprivrednikComponent } from './poljoprivrednik.component';

describe('PoljoprivrednikComponent', () => {
  let component: PoljoprivrednikComponent;
  let fixture: ComponentFixture<PoljoprivrednikComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoljoprivrednikComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoljoprivrednikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
