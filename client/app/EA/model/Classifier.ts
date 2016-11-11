import { EABaseClass } from './EABaseClass';

export class Classifier extends EABaseClass {
  visibility: string;

  constructor(json, parent: EABaseClass) {
    super(json, parent);
    this.visibility = json['_visibility'];
  }
}
