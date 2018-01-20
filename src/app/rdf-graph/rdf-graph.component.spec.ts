import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RdfGraphComponent } from './rdf-graph.component';

describe('RdfGraphComponent', () => {
  let component: RdfGraphComponent;
  let fixture: ComponentFixture<RdfGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RdfGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RdfGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
