import { TestBed, inject } from '@angular/core/testing';

import { JOwlService } from './j-owl.service';

describe('JOwlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JOwlService]
    });
  });

  it('should be created', inject([JOwlService], (service: JOwlService) => {
    expect(service).toBeTruthy();
  }));
});
