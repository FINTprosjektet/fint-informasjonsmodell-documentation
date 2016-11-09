import { Association } from './Association';
import { Stereotype } from './Stereotype';
import { EABaseClass } from './EABaseClass';
import { Attribute } from './Attribute';

export class Classification extends EABaseClass {
  visibility: string;
  attributes: Attribute[];
  type: string = 'table';
  associations: Association[];

  constructor(json, stereotype?: Stereotype) {
    super(json);
    this.visibility = json['_visibility'];

    if (stereotype && stereotype.associations) {
      this.associations = stereotype.associations.filter(assoc => assoc.meta['ea_sourceID'] === this.id);
    }

    if (json['Classifier.feature'] && json['Classifier.feature'].Attribute) {
      if (Array.isArray(json['Classifier.feature'].Attribute)) {
        this.attributes = json['Classifier.feature'].Attribute.map(attr => new Attribute(attr));
      } else {
        this.attributes = [new Attribute(json['Classifier.feature'].Attribute)];
      }
    }

    if (json['ModelElement.stereotype']) {
      this.type = json['ModelElement.stereotype'].Stereotype['_name'];
    }
  }

  filter(search: string) {
    let matchAttributes = [];
    let matchAssociations = [];
    let matchType = this.type.toLowerCase().indexOf(search.toLowerCase()) > -1;
    let matchName = this.name.toLowerCase().indexOf(search.toLowerCase()) > -1;

    if (this.associations) {
      matchAssociations = this.associations.filter(assoc => assoc.meta['rt'].toLowerCase().indexOf(search.toLowerCase()) > -1);
    }
    if (this.attributes) {
      matchAttributes = this.attributes.filter(attr => attr.name.toLowerCase().indexOf(search.toLowerCase()) > -1);
    }
    if (matchType || matchAttributes.length || matchAssociations.length || matchName) {
      return this;
    }
    return null;
  }
}
