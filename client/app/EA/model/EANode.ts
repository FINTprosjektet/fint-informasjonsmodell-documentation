import { EABaseClass } from './EABaseClass';
import { EANodeContainer } from './EANodeContainer';
import { Stereotype } from './Stereotype';

export abstract class EANode extends EABaseClass {
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

  get x(): number {
    const parent = this.parentPackage;
    const previous = this.getPrevious();
    let x = (previous ? (previous.x + previous.width) : parent.x) + 15;
    if (parent.width > 0) {
      if (previous && x + this.width > parent.x + parent.width) {
        x = parent.x + 15;
      }
    }
    return x;
  };

  get y(): number {
    const parent = this.parentPackage;
    const previous = this.getPrevious();
    const padding = 25;
    const x = (previous ? (previous.x + previous.width) : parent.x) + padding;
    let y = (previous ? previous.y : parent.y + padding);
    this.yLine = (previous ? previous.yLine : 1);

    if (parent.width > 0) {
      if (previous && x + this.width > parent.x + parent.width) {
        const prevHeight = this.getAllPrevious().map(p => p.height);
        let maxHeight = 5 + Math.max.apply(Math, prevHeight);
        if (!maxHeight) {
          maxHeight = previous.height;
        }
        y = previous.y + maxHeight;
        this.yLine++;
        y += 1 * this.yLine;
      }
    }
    return y;
  }

  constructor() {
    super();
  }

  _previous;
  getPrevious(): EANode {
    if (!this._previous && this.boxElement) {
      const previous = this.boxElement.previousSibling;
      if (previous && previous.nodeName === 'g') {
        const obj = previous['__data__'];
        if (obj) { this._previous = obj; }
      }
    }
    return this._previous;
  }

  _allPrev;
  getAllPrevious(): EANode[] {
    if (!this._allPrev) {
      const previous = this.getPrevious();
      if (previous) {
        this._allPrev = [previous];
        const others = previous.getAllPrevious();
        if (others && others.length) {
          this._allPrev.concat(others);
        }
      }
    }
    return this._allPrev;
  }
}
