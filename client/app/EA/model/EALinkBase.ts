import { EABaseClass } from './EABaseClass';
import { Classification } from './Classification';
import * as D3 from 'app/d3.bundle';

export abstract class EALinkBase extends EABaseClass {
  start: string;
  end: string;

  get source(): any {
    return EABaseClass.service.mapper.flatModel[this.start];
  }
  get target(): any {
    return EABaseClass.service.mapper.flatModel[this.end];
  }

  constructor() {
    super();
  }
}
