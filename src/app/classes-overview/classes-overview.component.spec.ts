import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesOverviewComponent } from './classes-overview.component';

describe('ClassesOverviewComponent', () => {
  let component: ClassesOverviewComponent;
  let fixture: ComponentFixture<ClassesOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassesOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
