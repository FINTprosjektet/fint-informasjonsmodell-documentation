import { EANode } from './EANode';
import { EABaseClass } from './EABaseClass';
import { EANodeContainer } from './EANodeContainer';
import { Stereotype } from './Stereotype';
import { Classification } from './Classification';
import { Comment } from './Comment';
import * as D3 from 'app/d3.bundle';

/**
 *
 */
export class Package extends EANodeContainer {
  static umlId = 'uml:Package';

  protected _isVisible: boolean;
  protected _lastSearch: string;
  public isVisible(): boolean {
    const str = EABaseClass.service.searchString;
    if (str && str.length > 0) {
      if (str == this._lastSearch) { return this._isVisible; }
      const meVisible = super.isVisible();
      const pkgVisible = this.packages.some(pkg => pkg.isVisible());
      const clsVisible = this.allClasses.some(cls => cls.isVisible());

      this._lastSearch = str;
      this._isVisible = (meVisible || pkgVisible || clsVisible);
      return this._isVisible;
    }
    return true;
  }

  // Properties for rendering
  width: number = 0;
  height: number = 0;

  constructor() {
    super();
  }
}
