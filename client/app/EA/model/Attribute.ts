import { ExpandablePipe } from '../../views/result/pipes/expandable.pipe';
import { EABaseClass } from './EABaseClass';

export class Attribute extends EABaseClass {
  static pipe = new ExpandablePipe();
  static umlId = 'uml:Property';
  parent: any;
  classRef: string;
  extension: any;
  type: any;
  upperValue: any;
  lowerValue: any;

  get id(): string { return this.cleanId(this.parent.id + '~' + this.name); }

  get documentation(): string {
    if (this.extension && this.extension.documentation) {
      return this.extension.documentation.map(e => e.value).join('');
    }
    return '';
  }

  get documentationHeader(): string {
    const doc = this.documentation;
    const idx = doc.indexOf('\n');
    return Attribute.pipe.stripHtml(idx > 0 ? doc.substr(0, doc.indexOf('\n')) : doc);
  }

  get documentationBody(): string {
    const doc = this.documentation;
    const idx = doc.indexOf('\n');
    return idx > 0 ? doc.substr(doc.indexOf('\n') + 1) : '';
  }

  get isPrimitive() {
    if (this.typeRef) {
      if (this.typeRef.xmiType === 'uml:PrimitiveType') { return true; }
      if (this.typeRef.type === 'XSDsimpleType') { return true; }
      return false;
    }
    return true;
  }

  get typeRef() {
    if (this.type && this.type.length) {
      if (this.type.length > 1) { throw new Error('Maximum number of types exceeded on attribute'); }
      return this.type[0].reference;
    }
    return null;
  }

  get typeName() {
    if (this.typeRef) { return this.typeRef.name; }
    if (this.upperValue[0].xmiType === 'uml:LiteralInteger') { return 'number'; }
    return '';
  }

  get multiplicity() {
    if (!this.isPrimitive && this.extension && this.extension.bounds) {
      return this.extension.bounds.map(b => `${b.lower}..${b.upper}`);
    }
    return '';
  }

  constructor() {
    super();
  }
}
