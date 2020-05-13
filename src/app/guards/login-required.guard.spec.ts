import { TestBed, async, inject } from '@angular/core/testing';

import { LoginRequiredGuard } from './login-required.guard';

describe('LoginRequiredGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginRequiredGuard]
    });
  });

  it('should ...', inject([LoginRequiredGuard], (guard: LoginRequiredGuard) => {
    expect(guard).toBeTruthy();
  }));
});
