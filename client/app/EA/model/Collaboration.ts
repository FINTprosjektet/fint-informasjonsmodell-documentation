import {EABaseClass} from './EABaseClass';
import {Classifier} from './Classifier';

export class Collaboration extends EABaseClass {
  interaction: {};
  classifiers: Classifier[];


  constructor(json: any) {
    super(json);
    if (json['Namespace.ownedElement'] && json['Namespace.ownedElement'].ClassifierRole) {
      if (Array.isArray(json['Namespace.ownedElement'].ClassifierRole)) {
        this.classifiers = json['Namespace.ownedElement'].ClassifierRole.map(cls => new Classifier(cls));
      } else {
        this.classifiers = [new Classifier(json['Namespace.ownedElement'].ClassifierRole)];
      }
    }
    if (json['Collaboration.interaction']) {
      this.interaction = json['Collaboration.interaction'];
    }

  }
}
