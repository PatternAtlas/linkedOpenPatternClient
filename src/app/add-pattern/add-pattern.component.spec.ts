import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatternComponent } from './add-pattern.component';

describe('AddPatternComponent', () => {
  let component: AddPatternComponent;
  let fixture: ComponentFixture<AddPatternComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPatternComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
