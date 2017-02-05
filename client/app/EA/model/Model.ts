import { EABaseClass } from './EABaseClass';
import { Package } from './Package';
import { Classification } from './Classification';


/**
 * Top node of the EA xml tree
 */
export class Model extends EABaseClass {
  static umlId = 'uml:Model';

  packagedElement: any;

  private _isVisible: boolean;
  private _lastSearch: string;
  public isVisible(): boolean {
    const str = EABaseClass.service.searchString;
    if (str && str.length > 0) {
      if (str == this._lastSearch) { return this._isVisible; }
      const meVisible = super.isVisible();
      const pkgVisible = this.packages.some(pkg => pkg.isVisible());

      this._lastSearch = str;
      this._isVisible = (meVisible || pkgVisible);
      return this._isVisible;
    }
    return true;
  }

  get packages() {
    const retArr = [];
    const pkgs = this.packagedElement[0].packagedElement;
    pkgs.forEach(elements => {
      elements.packagedElement.forEach(pkg => {
        if (pkg instanceof Package) {
          retArr.push(pkg);
        }
      });
    });
    return retArr;
  }

  constructor() {
    super();
  }
}
