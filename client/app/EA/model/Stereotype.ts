import { EABaseClass } from './EABaseClass';
import { Package } from './Package';
import { Classification } from './Classification';
import { Association } from './Association';

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
        type.class.forEach(cls => { cls.container = me; });
        subClasses = subClasses.concat(type.class);
      }));
    }
    me.class.forEach(cls => { cls.container = me; });
    return me.class.concat(subClasses);
  }

  // Properties for rendering
  boxConfig: {};
  textConfig: {};

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

  /**
   *
   *
   * @param {number} idx
   * @returns {}
   *
   * @memberOf Stereotype
   */
  renderBox(idx: number, margins) {
    if (!this.boxConfig) {
      this.boxConfig = {
        x: 1,
        y: (idx * 103) + 10,
        rx: 10,
        ry: 10,
        width: 700,
        height: 100
      };
    }
    return this.boxConfig;
  }

  /**
   *
   *
   * @param {number} idx
   * @param {any} margins
   * @returns
   *
   * @memberOf Stereotype
   */
  renderText(idx: number, margins) {
    if (!this.textConfig) {
      this.textConfig = {
        x: this.boxConfig['x'] + 10,
        y: this.boxConfig['y'] + 15
      };
    }
    return this.textConfig;
  }
}
