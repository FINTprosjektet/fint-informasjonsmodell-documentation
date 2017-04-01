import { EANodeContainer } from './EANodeContainer';
import { Classification } from './Classification';
import { Package } from './Package';
import { EABaseClass } from './EABaseClass';
import * as D3 from 'app/d3.bundle';

/**
 * Represents a top package
 *
 * @export
 * @class Stereotype
 * @extends {Package}
 */
export class Stereotype extends EANodeContainer {
  static umlId = 'uml:Package';

  width: number = 0;
  height: number = 0;

  /**
   * Creates an instance of Stereotype.
   *
   * @param {{}} json
   * @param {EABaseClass} parent
   *
   * @memberOf Stereotype
   */
  constructor() {
    super();
  }
}
