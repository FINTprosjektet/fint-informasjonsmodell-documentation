import { EABaseClass } from './EABaseClass';
import { Classification } from './Classification';
import { Comment } from './Comment';
import * as D3 from '../../d3.bundle';

/**
 *
 */
export class Package extends EABaseClass {
  static umlId = 'uml:Package';
  packagedElement: any;

  get classes(): Classification[] { return EABaseClass.service.getClasses(this); }
  get id(): string { return this.cleanId('package_' + this.name); }

  private _isVisible: boolean;
  private _lastSearch: string;
  public isVisible(): boolean {
    const str = EABaseClass.service.searchString;
    if (str && str.length > 0) {
      if (str == this._lastSearch) { return this._isVisible; }
      const meVisible = super.isVisible();
      const clsVisible = this.classes.some(cls => cls.isVisible());

      this._lastSearch = str;
      this._isVisible = (meVisible || clsVisible);
      return this._isVisible;
    }
    return true;
  }

  get parentPackage(): Package {
    let parent = this.parent;
    while (parent) {
      if (parent instanceof Package) {
        return parent;
      } else {
        parent = parent.parent;
      }
    }
    return null;
  }

  get packagePath(): string {
    const path = [];
    let pkg: Package = this;
    while (pkg != null) {
      path.unshift(pkg.name.toLowerCase());
      pkg = pkg.parentPackage;
      if (pkg.name === 'FINT') {
        pkg = null; // Hardcoded top package name
      }
    }
    return path.join('.');
  }


  // Properties for rendering
  private _boxElement: SVGGElement;
  get boxElement() { return this._boxElement; }
  set boxElement(elm: SVGGElement) {
    this._boxElement = elm;
    this.render();
  }
  x: number;
  y: number;
  width: number;
  height: number;

  constructor() {
    super();
  }
  render() {
    // Add a rect
    const d3Select = D3.select(this.boxElement);
    d3Select
      .attr('class', 'stereotype')
      .attr('id', this.xmiId)
      .append('rect')
      .attrs({ x: 0, y: 0, rx: 10, ry: 10, width: '100%', height: 100 });
    const bbox = this.boxElement.getBBox();
    this.width = bbox.width;
    this.height = bbox.height;

    // Add a header
    d3Select
      .append('text')
      .text(this.name)
      .attrs({ x: 10, y: 15 });
  }

  getHeight() {
    const classContainer = this.boxElement.querySelector('g');
    const bbox = (classContainer ? classContainer.getBBox() : this.boxElement.getBBox());
    return bbox.height + 70;
  }

  getPrevious() {
    if (this.boxElement.previousSibling) {
      return this.boxElement.previousSibling['__data__'];
    }
    return null;
  }

  update() {
    const idx = Array.prototype.indexOf.call(this.boxElement.parentNode.childNodes, this.boxElement);

    // Calculate width / height
    this.width = this.boxElement.ownerSVGElement.clientWidth - 5;
    this.height = this.getHeight();
    D3.select(this.boxElement.querySelector('rect'))
      .attrs({ width: this.width, height: this.height });


    // Calculate + render x/y translation
    const previous: any = this.getPrevious();
    this.x = 1;
    this.y = (previous ? (previous.y + previous.height) : 0) + 10;
    D3.select(this.boxElement)
      .attr('transform', `translate(${this.x}, ${this.y})`);
  }
}
