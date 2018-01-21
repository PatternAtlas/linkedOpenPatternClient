import { TestBed, inject } from '@angular/core/testing';

import { RdfaService } from './rdfa.service';

describe('RdfaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RdfaService]
    });
  });

  it('should be created', inject([RdfaService], (service: RdfaService) => {
    expect(service).toBeTruthy();
  }));
});
