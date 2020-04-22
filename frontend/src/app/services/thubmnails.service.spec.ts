import { TestBed } from '@angular/core/testing';

import { ThubmnailsService } from './thubmnails.service';

describe('ThubmnailsService', () => {
  let service: ThubmnailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThubmnailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
