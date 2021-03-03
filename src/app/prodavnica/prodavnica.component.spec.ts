import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdavnicaComponent } from './prodavnica.component';

describe('ProdavnicaComponent', () => {
  let component: ProdavnicaComponent;
  let fixture: ComponentFixture<ProdavnicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdavnicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdavnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
