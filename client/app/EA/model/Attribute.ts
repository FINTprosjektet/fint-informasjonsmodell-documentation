import { MarkdownToHtmlPipe } from 'markdown-to-html-pipe';
import { EABaseClass } from './EABaseClass';
import { ExpandablePipe } from '../../views/result/pipes/expandable.pipe';

export class Attribute extends EABaseClass {
  static pipe = new ExpandablePipe();
  static markPipe = new MarkdownToHtmlPipe()

  static umlId = 'uml:Property';
  parent: any;
  classRef: string;
  extension: any;
  type: any;
  upperValue: any;
  lowerValue: any;

  get id(): string { return this.cleanId('~' + this.name); }

  private _isVisible: boolean;
  private _lastSearch: string;
  public isVisible(): boolean {
    const str = EABaseClass.service.searchString;
    if (str && str.length > 0) {
      if (str == this._lastSearch) { return this._isVisible; }
      const meVisible = super.isVisible();
      const typeVisible = this.match(this.typeName);

      this._lastSearch = str;
      this._isVisible = (meVisible || typeVisible);
      return this._isVisible;
    }
    return true;
  }

  private _isOpen: boolean = false;
  get isOpen() { return this._isOpen; }
  set isOpen(flag) {
    if (flag) { this.parent.members.forEach(m => m.isOpen = false); } // Close others
    this._isOpen = flag;
  }

  _documentation: string;
  get documentation(): string {
    if (!this._documentation) {
      if (this.extension && this.extension.documentation) {
        this._documentation = this.extension.documentation.map(e => e.value).join('');
      }
    }
    return this._documentation || '';
  }

  _headerClean: string;
  get documentationHeader(): string {
    if (!this._headerClean) {
      const doc = this.documentation;
      const idx = doc.indexOf('\n');
      this._headerClean = idx > 0 ? doc.substr(0, doc.indexOf('\n')) : doc;
    }
    return this._headerClean;
  }

  _docBody: string;
  get documentationBody(): string {
    if (!this._docBody) {
      const doc = this.documentation;
      const idx = doc.indexOf('\n');
      this._docBody = Attribute.markPipe.transform(idx > 0 ? doc.substr(doc.indexOf('\n') + 1) : '');
    }
    return this._docBody;
  }

  _isPrimitive: boolean;
  get isPrimitive() {
    if (!this._isPrimitive) {
      if (this.typeRef) {
        if (this.typeRef.xmiType === 'uml:PrimitiveType') { this._isPrimitive = true; }
        else if (this.typeRef.type === 'XSDsimpleType') { this._isPrimitive = true; }
        else { this._isPrimitive = false; }
      } else {
        this._isPrimitive = true;
      }
    }
    return this._isPrimitive;
  }

  get typeRef() {
    if (this.type && this.type.length) {
      if (this.type.length > 1) { throw new Error('Maximum number of types exceeded on attribute'); }
      return this.type[0].reference;
    }
    return null;
  }

  _typeName: string;
  get typeName() {
    if (!this._typeName) {
      if (this.typeRef) { this._typeName = this.typeRef.name; }
      else if (this.extension && this.extension.properties && this.extension.properties.length) {
        this._typeName = this.extension.properties[0].type;
      }
      else if (this.upperValue[0].xmiType === 'uml:LiteralInteger') { this._typeName = 'number'; }
    }
    return this._typeName;
  }

  get multiplicity() {
    if (this.extension && this.extension.bounds) {
      const bounds = this.extension.bounds[0];
      if (bounds.lower === bounds.upper) {
        return bounds.lower;
      }
      return this.extension.bounds.map(b => `${b.lower}..${b.upper}`);
    } else if (this.lowerValue && this.upperValue) {
      return `${this.lowerValue[0].value}..${this.upperValue[0].value}`
    }
    return '';
  }

  constructor() {
    super();
  }
}
