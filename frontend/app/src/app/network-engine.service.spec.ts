import { TestBed } from '@angular/core/testing';

import { NetworkEngineService } from './network-engine.service';

describe('NetworkEngineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NetworkEngineService = TestBed.get(NetworkEngineService);
    expect(service).toBeTruthy();
  });
});
