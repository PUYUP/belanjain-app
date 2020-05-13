import { TestBed } from '@angular/core/testing';

import { NecessaryService } from './necessary.service';

describe('NecessaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NecessaryService = TestBed.get(NecessaryService);
    expect(service).toBeTruthy();
  });
});
