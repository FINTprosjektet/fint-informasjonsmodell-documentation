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

  findById(xmlId: string): EABaseClass {
    if (this.id === xmlId) { return this; }

    let match = this.filterChildren(this.attributes, xmlId);
    if (match) { return match; }

    return null;
  }
}
