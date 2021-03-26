import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcnesComponent } from './acnes.component';

describe('AcnesComponent', () => {
  let component: AcnesComponent;
  let fixture: ComponentFixture<AcnesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcnesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcnesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
