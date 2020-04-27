import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasuresInfoComponent } from './measures-info.component';

describe('MeasuresInfoComponent', () => {
  let component: MeasuresInfoComponent;
  let fixture: ComponentFixture<MeasuresInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasuresInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasuresInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
