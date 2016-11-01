import { EABaseClass } from './EABaseClass';

export class Attribute extends EABaseClass {
  visibility: string;

  constructor(json) {
    super(json);
    this.visibility = json['_visibility'];
  }
}
