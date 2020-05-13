import { TestBed } from '@angular/core/testing';

import { ShoptaskService } from './shoptask.service';

describe('ShoptaskService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShoptaskService = TestBed.get(ShoptaskService);
    expect(service).toBeTruthy();
  });
});
