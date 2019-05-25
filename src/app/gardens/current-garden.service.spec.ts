import { TestBed } from '@angular/core/testing';

import { CurrentGardenService } from './current-garden.service';

describe('CurrentGardenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrentGardenService = TestBed.get(CurrentGardenService);
    expect(service).toBeTruthy();
  });
});
