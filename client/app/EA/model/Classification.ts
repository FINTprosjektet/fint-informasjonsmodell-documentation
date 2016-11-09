import { EABaseClass } from './EABaseClass';
import { Attribute } from './Attribute';

export class Classification extends EABaseClass {
  visibility: string;
  attributes: Attribute[];

  constructor(json) {
    super(json);
    this.visibility = json['_visibility'];

    if (json['Classifier.feature'] && json['Classifier.feature'].Attribute) {
      if (Array.isArray(json['Classifier.feature'].Attribute)) {
        this.attributes = json['Classifier.feature'].Attribute.map(attr => new Attribute(attr));
      } else {
        this.attributes = [new Attribute(json['Classifier.feature'].Attribute)];
      }
    }
  }

  filter(search: string) {
    if (this.name.toLowerCase().indexOf(search.toLowerCase()) > -1) {
      return this;
    }
    return null;
  }
}
