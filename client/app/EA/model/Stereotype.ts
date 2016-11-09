import { EABaseClass } from './EABaseClass';
import { Package } from './Package';
import { Classification } from './Classification';
import { Association } from './Association';

export class Stereotype extends EABaseClass {
  visibility: string;
  meta: {};
  associations: Association[];
  class: Classification[];
  packages: Package[];

  constructor(json: {}) {
    super(json);
    this.visibility = json['_visibility'];

    if (json['Namespace.ownedElement'].Association) {
      if (Array.isArray(json['Namespace.ownedElement'].Association)) {
        this.associations = json['Namespace.ownedElement'].Association.map(assoc => new Association(assoc));
      } else {
        this.associations = [new Association(json['Namespace.ownedElement'].Association)];
      }
    }

    if (json['Namespace.ownedElement'].Class) {
      if (Array.isArray(json['Namespace.ownedElement'].Class)) {
        this.class = json['Namespace.ownedElement'].Class.map(cls => new Classification(cls));
      } else {
        this.class = [new Classification(json['Namespace.ownedElement'].Class)];
      }
    }

    if (json['Namespace.ownedElement'].Package) {
      if (Array.isArray(json['Namespace.ownedElement'].Package)) {
        this.packages = json['Namespace.ownedElement'].Package.map(assoc => new Package(assoc));
      } else {
        this.packages = [new Package(json['Namespace.ownedElement'].Package)];
      }
    }
  }

  filter(search: string) {
    if (this.class) {
      this.class = this.class.filter(cls => cls.filter(search));
    }
    if (this.packages) {
      this.packages = this.packages.filter(pkg => pkg.filter(search));
    }
    return this;
  }
}
