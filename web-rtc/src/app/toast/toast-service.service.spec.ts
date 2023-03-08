import { TestBed } from '@angular/core/testing';

import { ToastVisibilityService } from './toast-visibility.service';

describe('ToastServiceService', () => {
  let service: ToastVisibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastVisibilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
