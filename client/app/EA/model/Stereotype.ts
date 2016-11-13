import { document } from '@angular/platform-browser/src/facade/browser';
import { EABaseClass } from './EABaseClass';
import { Package } from './Package';
import { Classification } from './Classification';
import { Association } from './Association';
import * as D3 from '../../d3.bundle';

/**
 *
 *
 * @export
 * @class Stereotype
 * @extends {EABaseClass}
 */
export class Stereotype extends EABaseClass {
  visibility: string;
  meta: {};
  associations: Association[];
  class: Classification[];
  packages: Package[];

  get allClasses(): Classification[] {
    let subClasses: Classification[] = [];
    let me = this;
    if (me.packages) {
      me.packages.forEach(pkg => pkg.stereotypes.forEach(type => {
        subClasses = subClasses.concat(type.class);
      }));
    }
    return me.class.concat(subClasses);
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

  /**
   * Creates an instance of Stereotype.
   *
   * @param {{}} json
   * @param {EABaseClass} parent
   *
   * @memberOf Stereotype
   */
  constructor(json: {}, parent: EABaseClass) {
    super(json, parent);
    this.visibility = json['_visibility'];

    if (json['Namespace.ownedElement'].Association) {
      if (Array.isArray(json['Namespace.ownedElement'].Association)) {
        this.associations = json['Namespace.ownedElement'].Association.map(assoc => new Association(assoc, this));
      } else {
        this.associations = [new Association(json['Namespace.ownedElement'].Association, this)];
      }
    }

    if (json['Namespace.ownedElement'].Class) {
      if (Array.isArray(json['Namespace.ownedElement'].Class)) {
        this.class = json['Namespace.ownedElement'].Class.map(cls => new Classification(cls, this));
      } else {
        this.class = [new Classification(json['Namespace.ownedElement'].Class, this)];
      }
    }

    if (json['Namespace.ownedElement'].Package) {
      if (Array.isArray(json['Namespace.ownedElement'].Package)) {
        this.packages = json['Namespace.ownedElement'].Package.map(assoc => new Package(assoc, this));
      } else {
        this.packages = [new Package(json['Namespace.ownedElement'].Package, this)];
      }
    }
  }

  /**
   *
   *
   * @param {string} search
   * @returns
   *
   * @memberOf Stereotype
   */
  filter(search: string) {
    if (this.class) {
      this.class = this.class.filter(cls => cls.filter(search));
    }
    if (this.packages) {
      this.packages = this.packages.filter(pkg => pkg.filter(search));
    }
    if ((this.class && this.class.length) || (this.packages && this.packages.length)) {
      return this;
    }
    return null;
  }

  render() {
    // Add a rect
    let d3Select = D3.select(this.boxElement);
    d3Select
      .attr('class', 'stereotype')
      .attr('id', this.xmlId)
      .append('rect')
      .attrs({ x: 0, y: 0, rx: 10, ry: 10, width: '100%', height: 100 });
    let bbox = this.boxElement.getBBox();
    this.width = bbox.width;
    this.height = bbox.height;

    // Add a header
    d3Select
      .append('text')
      .text(this.name)
      .attrs({ x: 10, y: 15 });
  }

  getHeight() {
    let classContainer = this.boxElement.querySelector('g');
    let bbox = (classContainer ? classContainer.getBBox() : this.boxElement.getBBox());
    return bbox.height + 70;
  }

  getPrevious() {
    if (this.boxElement.previousSibling) {
      return this.boxElement.previousSibling['__data__'];
    }
    return null;
  }

  update() {
    let idx = Array.prototype.indexOf.call(this.boxElement.parentNode.childNodes, this.boxElement);

    // Calculate width / height
    this.width = this.boxElement.ownerSVGElement.clientWidth - 5;
    this.height = this.getHeight();
    D3.select(this.boxElement.querySelector('rect'))
      .attrs({ width: this.width, height: this.height });


    // Calculate + render x/y translation
    let previous: Stereotype = this.getPrevious();
    this.x = 1;
    this.y = (previous ? (previous.y + previous.height) : 0) + 10;
    D3.select(this.boxElement)
      .attr('transform', `translate(${this.x}, ${this.y})`);
  }
}
