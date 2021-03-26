import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaskFaceComponent } from './mask-face.component';

describe('MaskFaceComponent', () => {
  let component: MaskFaceComponent;
  let fixture: ComponentFixture<MaskFaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaskFaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaskFaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
