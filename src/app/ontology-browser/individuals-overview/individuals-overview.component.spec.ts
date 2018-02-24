import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualsOverviewComponent } from './individuals-overview.component';

describe('IndividualsOverviewComponent', () => {
  let component: IndividualsOverviewComponent;
  let fixture: ComponentFixture<IndividualsOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualsOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
