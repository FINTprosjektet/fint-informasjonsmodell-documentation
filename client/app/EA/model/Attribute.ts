import { EABaseClass } from './EABaseClass';

export class Attribute extends EABaseClass {
  visibility: string;
  classRef: string;

  _sourceType: EABaseClass;
  get sourceType(): EABaseClass {
    if (!this._sourceType && this.classRef) {
      this._sourceType = EABaseClass.service.findByXmlId(this.classRef);
    }
    return this._sourceType;
  }

  constructor(json) {
    super(json);
    this.visibility = json['_visibility'];

    if (json['StructuralFeature.type']) {
      this.classRef = json['StructuralFeature.type'].Classifier['_xmi.idref'];
    }
  }
}
