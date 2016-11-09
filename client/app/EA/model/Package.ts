import { Stereotype } from './Stereotype';
import { Collaboration } from './Collaboration';
import { EABaseClass } from './EABaseClass';

/**
 *
 */
export class Package extends EABaseClass {
  collaboration: Collaboration;
  package: Package;
  stereotypes: Stereotype[];

  constructor(json: {}) {
    super(json);
    if (json['Namespace.ownedElement'] && json['Namespace.ownedElement'].Collaboration) {
      this.collaboration = new Collaboration(json['Namespace.ownedElement'].Collaboration);
    }
    if (json['Namespace.ownedElement'] && json['Namespace.ownedElement'].Package) {
      if (Array.isArray(json['Namespace.ownedElement'].Package)) {
        this.stereotypes = json['Namespace.ownedElement'].Package.map(cls => new Stereotype(cls));
      } else {
        this.package = new Package(json['Namespace.ownedElement'].Package);
      }
    }
  }

  filter(search: string) {
    if (this.package) {
      this.package = this.package.filter(search);
    }
    if (this.stereotypes) {
      this.stereotypes = this.stereotypes.filter(stereotype => stereotype.filter(search));
    }
    return this;
  }
}
