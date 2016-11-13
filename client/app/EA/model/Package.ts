import { Stereotype } from './Stereotype';
import { Collaboration } from './Collaboration';
import { EABaseClass } from './EABaseClass';
import * as D3 from '../../d3.bundle';

/**
 *
 */
export class Package extends EABaseClass {
  collaboration: Collaboration;
  package: Package;
  stereotypes: Stereotype[] = [];

  constructor(json: {}, parent: EABaseClass) {
    super(json, parent);
    if (json['Namespace.ownedElement'] && json['Namespace.ownedElement'].Collaboration) {
      this.collaboration = new Collaboration(json['Namespace.ownedElement'].Collaboration, this);
    }
    if (json['Namespace.ownedElement'] && json['Namespace.ownedElement'].Package) {
      if (Array.isArray(json['Namespace.ownedElement'].Package)) {
        this.stereotypes = json['Namespace.ownedElement'].Package.map(cls => new Stereotype(cls, this));
      } else {
        this.package = new Package(json['Namespace.ownedElement'].Package, this);
      }
    }
  }

  filter(search: string, forceReturn?: boolean) {
    if (this.package) {
      this.package = this.package.filter(search);
    }
    if (this.stereotypes) {
      this.stereotypes = this.stereotypes.filter(stereotype => stereotype.filter(search));
    }
    if (forceReturn || this.package || (this.stereotypes && this.stereotypes.length)) {
      return this;
    }
    return null;
  }
}
