/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InViewService } from './in-view.service';

describe('InViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InViewService]
    });
  });

  it('should ...', inject([InViewService], (service: InViewService) => {
    expect(service).toBeTruthy();
  }));
});
