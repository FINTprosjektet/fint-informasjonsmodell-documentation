import { TestBed, inject } from '@angular/core/testing';

import { ModelStateService } from './model-state.service';

describe('ModelStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModelStateService]
    });
  });

  it('should ...', inject([ModelStateService], (service: ModelStateService) => {
    expect(service).toBeTruthy();
  }));
});
