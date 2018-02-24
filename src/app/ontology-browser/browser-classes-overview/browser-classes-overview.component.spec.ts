import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserClassesOverviewComponent } from './browser-classes-overview.component';

describe('BrowserClassesOverviewComponent', () => {
  let component: BrowserClassesOverviewComponent;
  let fixture: ComponentFixture<BrowserClassesOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowserClassesOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowserClassesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
