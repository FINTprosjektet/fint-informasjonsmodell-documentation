import { EABaseClass } from './EABaseClass';

export class Classifier extends EABaseClass {
  visibility: string;

  constructor(json) {
    super(json);
    this.visibility = json['_visibility'];
  }
}
