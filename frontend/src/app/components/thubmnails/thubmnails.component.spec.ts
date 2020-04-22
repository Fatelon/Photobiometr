import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThubmnailsComponent } from './thubmnails.component';

describe('ThubmnailsComponent', () => {
  let component: ThubmnailsComponent;
  let fixture: ComponentFixture<ThubmnailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThubmnailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThubmnailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
