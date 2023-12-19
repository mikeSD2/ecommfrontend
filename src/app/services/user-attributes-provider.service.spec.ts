import { TestBed } from '@angular/core/testing';

import { UserAttributesProviderService } from './user-attributes-provider.service';

describe('UserAttributesProviderService', () => {
  let service: UserAttributesProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAttributesProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
