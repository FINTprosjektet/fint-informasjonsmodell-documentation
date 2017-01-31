import { Collaboration } from './Collaboration';
import { Package } from './Package';
import { Classification } from './Classification';
import { EABaseClass } from './EABaseClass';


/**
 * Top node of the EA xml tree
 */
export class Model extends EABaseClass {
  static umlId = 'uml:Model';

  get packages() { return EABaseClass.service.getTopPackages(); }

  constructor() {
    super();
  }
}
