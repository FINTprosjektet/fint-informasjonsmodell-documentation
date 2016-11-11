import { EABaseClass } from './EABaseClass';
import { Classifier } from './Classifier';

export class Collaboration extends EABaseClass {
  interaction: {};
  classifiers: Classifier[];


  constructor(json: any, parent: EABaseClass) {
    super(json, parent);
    if (json['Namespace.ownedElement'] && json['Namespace.ownedElement'].ClassifierRole) {
      if (Array.isArray(json['Namespace.ownedElement'].ClassifierRole)) {
        this.classifiers = json['Namespace.ownedElement'].ClassifierRole.map(cls => new Classifier(cls, this));
      } else {
        this.classifiers = [new Classifier(json['Namespace.ownedElement'].ClassifierRole, this)];
      }
    }
    if (json['Collaboration.interaction']) {
      this.interaction = json['Collaboration.interaction'];
    }
  }
}
