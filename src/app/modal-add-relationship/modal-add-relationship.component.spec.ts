import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddRelationshipComponent } from './modal-add-relationship.component';

describe('ModalAddRelationshipComponent', () => {
  let component: ModalAddRelationshipComponent;
  let fixture: ComponentFixture<ModalAddRelationshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddRelationshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
