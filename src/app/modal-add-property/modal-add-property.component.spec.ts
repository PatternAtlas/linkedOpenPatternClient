import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddPropertyComponent } from './modal-add-property.component';

describe('ModalAddPropertyComponent', () => {
  let component: ModalAddPropertyComponent;
  let fixture: ComponentFixture<ModalAddPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
