import { EABaseClass } from './EABaseClass';
import { EANodeContainer } from './EANodeContainer';
import { Stereotype } from './Stereotype';

export abstract class EANode extends EABaseClass {
  extension: any;

  abstract width: number;
  abstract height: number;

  yLine = 1;
  x: number = 0;
  y: number = 0;

  _package: EANodeContainer;
  get parentPackage(): EANodeContainer {
    if (!this._package) {
      let parent = this.parent;
      while (parent) {
        if (parent instanceof EANodeContainer) {
          this._package = parent;
          break;
        }
        parent = parent.parent;
      }
    }
    return this._package;
  }

  _stereotype;
  get stereotype(): Stereotype {
    if (!this._stereotype) {
      let parent = this.parent;
      while (parent) {
        if (parent instanceof Stereotype) {
          this._stereotype = parent;
          break;
        }
        parent = parent.parent;
      }
    }
    return this._stereotype;
  }

  constructor() {
    super();
  }
}
