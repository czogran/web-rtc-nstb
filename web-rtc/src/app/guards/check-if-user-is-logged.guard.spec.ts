import { TestBed } from '@angular/core/testing';

import { CheckIfUserIsLoggedGuard } from './check-if-user-is-logged.guard';

describe('CheckIfUserIsLoggedGuard', () => {
  let guard: CheckIfUserIsLoggedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CheckIfUserIsLoggedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
