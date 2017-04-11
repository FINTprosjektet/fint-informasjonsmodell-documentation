import { EABaseClass } from './EABaseClass';
import { EANode } from './EANode';
import { Package } from './Package';
import { Classification } from './Classification';

export abstract class EANodeContainer extends EANode {
  packagedElement: any;
  extension: any;

  _id: string;
  get id(): string {
    if (!this._id) { this._id = this.cleanId('package_' + this.name); }
    return this._id;
  }

  get packagePath(): string {
    const path = [];
    let pkg: EANodeContainer = this;
    while (pkg != null) {
      path.unshift(pkg.name.toLowerCase());
      pkg = pkg.parentPackage;
      if (pkg.name === 'FINT') {
        pkg = null; // Hardcoded top package name
      }
    }
    return path.join('.');
  }

  _packages: EANodeContainer[];
  get packages() {
    if (!this._packages) { this._packages = this.packagedElement.filter(element => element instanceof EANodeContainer).sort(EABaseClass.service.sortNodes); }
    return this._packages;
  }

  _allPackageCache: EANodeContainer[];
  get allPackages() {
    if (!this._allPackageCache) { this._allPackageCache = EABaseClass.service.getPackages(this).sort(EABaseClass.service.sortNodes); }
    return this._allPackageCache;
  }

  _classCache: Classification[];
  get classes(): Classification[] {
    if (!this._classCache) { this._classCache = this.packagedElement.filter(element => element instanceof Classification).sort(EABaseClass.service.sortNodes); }
    return this._classCache;
  }

  _allClassCache: Classification[];
  get allClasses(): Classification[] {
    if (!this._allClassCache) { this._allClassCache = EABaseClass.service.getClasses(this).sort(EABaseClass.service.sortNodes); }
    return this._allClassCache;
  }

  _depth: number;
  getInnerDepth(): number {
    if (!this._depth) {
      if (this.packages.length) {
        const depths = this.packages.map(p => p.getInnerDepth());
        this._depth = 1 + Math.max.apply(Math, depths);
      } else {
        this._depth = 1;
      }
    }
    return this._depth;
  }

  constructor() {
    super();
  }
}
