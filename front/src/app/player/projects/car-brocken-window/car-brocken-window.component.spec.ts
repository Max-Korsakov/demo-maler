import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarBrockenWindowComponent } from './car-brocken-window.component';

describe('CarBrockenWindowComponent', () => {
  let component: CarBrockenWindowComponent;
  let fixture: ComponentFixture<CarBrockenWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarBrockenWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarBrockenWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
