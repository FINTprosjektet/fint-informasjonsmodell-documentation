import { Package } from './Package';
import { Classifier } from './Classifier';
import { Association } from './Association';
import { Stereotype } from './Stereotype';
import { EABaseClass } from './EABaseClass';
import { Attribute } from './Attribute';

export class Classification extends EABaseClass {
  visibility: string;
  attributes: Attribute[];
  type: string = 'table';
  associations: Association[];

  // Properties for rendering
  container: Stereotype;
  width: number;
  boxConfig: {};
  textConfig: {};

  constructor(json, parent: EABaseClass) {
    super(json, parent);
    this.visibility = json['_visibility'];

    if (parent instanceof Stereotype && (<Stereotype>parent).associations) {
      this.associations = (<Stereotype>parent).associations.filter(assoc => assoc.meta['ea_sourceID'] === this.id);
    }

    if (json['Classifier.feature'] && json['Classifier.feature'].Attribute) {
      if (Array.isArray(json['Classifier.feature'].Attribute)) {
        this.attributes = json['Classifier.feature'].Attribute.map(attr => new Attribute(attr, this));
      } else {
        this.attributes = [new Attribute(json['Classifier.feature'].Attribute, this)];
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

  /**
   *
   *
   * @param {number} idx
   * @param {any} margins
   * @returns
   *
   * @memberOf Classification
   */
  renderBox(idx: number, margins) {
    if (!this.boxConfig) {
      let parent: Stereotype = this.container;
      let previous: Classification;
      if (idx > 0) { previous = parent.allClasses[idx - 1]; }
      let x = parent.boxConfig['x'] + (previous ? previous.boxConfig['x'] + previous.boxConfig['width'] : 0) + 10;
      let y = (previous ? previous.boxConfig['y'] : parent.boxConfig['y'] + 20);
      if ((x + this.width) > parent.boxConfig['width']) {
        // Fall down one line
        y = previous.boxConfig['y'] + 35;
        x = 10;
      }
      this.boxConfig = {
        x: x,
        y: y,
        rx: 5,
        ry: 5,
        width: this.width,
        height: 30
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
   * @memberOf Classification
   */
  renderText(idx: number, margins) {
    if (!this.textConfig) {
      this.textConfig = {
        x: this.boxConfig['x'] + 10,
        y: this.boxConfig['y'] + 20
      };
    }
    return this.textConfig;
  }
}
