import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DijagramComponent } from './dijagram.component';

describe('DijagramComponent', () => {
  let component: DijagramComponent;
  let fixture: ComponentFixture<DijagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DijagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DijagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
