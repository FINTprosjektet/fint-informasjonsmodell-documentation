import { EABaseClass } from './EABaseClass';
import { EANodeContainer } from './EANodeContainer';

export abstract class EANode extends EABaseClass {
  abstract x: number;
  abstract y: number;
  abstract width: number;
  abstract height: number;

  yLine = 1;

  _package: EANodeContainer;
  get parentPackage(): EANodeContainer {
    if (!this._package) {
      let parent = this.parent;
      while (parent) {
        if (parent instanceof EANodeContainer) {
          this._package = parent;
          break;
        } else {
          parent = parent.parent;
        }
      }
    }
    return this._package;
  }

  constructor() {
    super();
  }
}
