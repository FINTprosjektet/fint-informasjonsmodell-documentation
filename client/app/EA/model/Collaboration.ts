import { EABaseClass } from './EABaseClass';
import { Classifier } from './Classifier';

export class Collaboration extends EABaseClass {
  interaction: {};
  classifiers: Classifier[];


  constructor() {
    super();
  }

  apply(json, parent: EABaseClass) {
    super.apply(json, parent);
    if (json['Namespace.ownedElement'] && json['Namespace.ownedElement'].ClassifierRole) {
      if (Array.isArray(json['Namespace.ownedElement'].ClassifierRole)) {
        this.classifiers = json['Namespace.ownedElement'].ClassifierRole.map(cls => new Classifier().apply(cls, this));
      } else {
        this.classifiers = [new Classifier().apply(json['Namespace.ownedElement'].ClassifierRole, this)];
      }
    }
    if (json['Collaboration.interaction']) {
      this.interaction = json['Collaboration.interaction'];
    }
    return this;
  }
}
