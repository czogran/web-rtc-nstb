import { TestBed } from '@angular/core/testing';

import { SearchUsersService } from './search-users.service';

describe('SearchUsersService', () => {
  let service: SearchUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
