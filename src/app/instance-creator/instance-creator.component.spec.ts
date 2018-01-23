import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceCreatorComponent } from './instance-creator.component';

describe('InstanceCreatorComponent', () => {
  let component: InstanceCreatorComponent;
  let fixture: ComponentFixture<InstanceCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstanceCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstanceCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
