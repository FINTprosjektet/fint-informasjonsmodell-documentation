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
  protected _id: string;
  get id(): string {
    if (!this._id) {
      const pkgName = (this.parentPackage ? this.parentPackage.name : '');
      this._id = this.cleanId(pkgName + '_' + this.name);
    }
    return this._id;
  }

  private _package: EANodeContainer;
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

  private _packagePath;
  get packagePath(): string {
    if (!this._packagePath) {
      const path = [];
      let pkg: EANode = this;
      while (pkg != null) {
        path.unshift(this.cleanId(pkg.name));
        pkg = pkg.parentPackage;
        if (pkg && pkg.name === 'FINT') {
          pkg = null; // Hardcoded top package name
        }
      }
      this._packagePath = path.join('.');
    }
    return this._packagePath;
  }


  private _stereotype;
  get stereotype(): Stereotype {
    if (!this._stereotype) {
      if (this instanceof Stereotype) {
        this._stereotype = this;
      }
      else {
        let parent = this.parent;
        while (parent) {
          if (parent instanceof Stereotype) {
            this._stereotype = parent;
            break;
          }
          parent = parent.parent;
        }
      }
    }
    return this._stereotype;
  }

  private _level: number;
  get levelFromStereotype(): number {
    if (!this._level) {
      this._level = 0;
      let n: EANode = this;
      while (!(n instanceof Stereotype) && n.parentPackage != null) {
        this._level++;
        n = n.parentPackage;
      }
    }
    return this._level;
  }

  _cssPackages: string[] = [];
  get cssPackages() {
    if (!this._cssPackages.length) {
      let n: EANode = this;
      while (n) {
        if (n.parentPackage) {
          this._cssPackages.push(this.cleanId(n.parentPackage.name));
        }
        n = n.parentPackage;
        if (n instanceof Stereotype) {
          break;
        }
      }
    }
    return this._cssPackages;
  }

  constructor() {
    super();
  }
}
