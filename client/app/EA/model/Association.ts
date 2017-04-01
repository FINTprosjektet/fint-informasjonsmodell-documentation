import { EABaseClass } from './EABaseClass';
import { EALinkBase } from './EALinkBase';
import { Classification } from './Classification';
import * as D3 from 'app/d3.bundle';

export class Association extends EALinkBase {
  static umlId = 'uml:Association';
  parent: any;

  constructor() {
    super();
  }
}
