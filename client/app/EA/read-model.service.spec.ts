/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReadModelService } from './read-model.service';

describe('Service: ReadModel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReadModelService]
    });
  });

  it('should ...', inject([ReadModelService], (service: ReadModelService) => {
    expect(service).toBeTruthy();
  }));
});
