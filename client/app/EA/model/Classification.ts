import { MarkdownToHtmlPipe } from 'markdown-to-html-pipe';

import { EABaseClass } from './EABaseClass';
import { EANodeContainer } from './EANodeContainer';
import { EANode } from './EANode';
import { Stereotype } from './Stereotype';
import { Package } from './Package';
import { Generalization } from './Generalization';
import { Association } from './Association';
import { Attribute } from './Attribute';
import * as D3 from 'app/d3.bundle';

export class Classification extends EANode {
  static markPipe = new MarkdownToHtmlPipe();
  static umlId = 'uml:Class';

  xmiId: string;
  referredBy: any[];
  generalization: any;
  ownedAttribute: Attribute[];
  isAbstract;

  get id(): string {
    if (!this._id) {
      const pkgName = (this.parentPackage ? this.parentPackage.name : '');
      this._id = this.cleanId(pkgName + '_' + this.name);
    }
    return this._id;
  }

  /**
   * Used for search filtration
   */
  private _isVisible: boolean;
  private _lastSearch: string;

  get members(): Attribute[] {
    return this.ownedAttribute;
  }

  _associations;
  get associations(): Association[] {
    if (!this._associations) {
      this._associations = [];
      if (this.referredBy) {
        this.referredBy.forEach(r => {
          if (r instanceof Association
             && (r.start === this.xmiId && r.extension.target[0].role[0].name
              || r.end === this.xmiId && r.extension.source[0].role[0].name)) {
            this._associations.push(r);
          }
        });
      }
    }
    return this._associations;
  }

  _isBaseClass = null;
  get isBaseClass(): boolean {
    if (this._isBaseClass == null) {
      if (this.extension && this.extension.project && this.extension.project.length) {
        const meta = this.extension.project[0];
        this._isBaseClass = meta.keywords && meta.keywords.indexOf('hovedklasse') > -1;
      }
      else {
        this._isBaseClass = false;
      }
    }
    return this._isBaseClass;
  }

  _type;
  get type(): string {
    if (!this._type) {
      if (this.isAbstract === 'true') { this._type = 'abstract'; }
      else if (this.isBaseClass) { this._type = 'mainclass'; }
      else if (this.extension && this.extension.properties && this.extension.properties.length) {
        const meta = this.extension.properties[0];
        this._type = meta.stereotype || meta.sType || meta.xmiType.substr('uml:'.length);
      }
      else { this._type = 'table'; }
    }
    return this._type;
  }

  get typeDesc() {
    switch (this.type.toLowerCase()) {
      case 'mainclass': return 'Hovedklasse';
      case 'class': return 'Kompleks datatype';
      case 'codelist': return 'Utlisting';
      case 'datatype': return 'Datatype';
      case 'enumeration': return 'Enumerering';
      case 'abstract': return 'Abstrakt';
      default: return '';
    }
  }

  _documentation: string;
  get documentation(): string {
    if (!this._documentation) {
      if (this.extension && this.extension.properties) {
        this._documentation = EABaseClass.service.cleanDocumentation(this.extension.properties.map(e => e.documentation).join(''));
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

  _subTypes;
  get subTypes(): any[] {
    const me = this;
    if (this._subTypes) { return this._subTypes; }
    if (this.referredBy) {
      this._subTypes = this.referredBy
        .filter((c, idx, self) => {
          const index = self.findIndex(x => x.start === c.start);
          const isRelated = (c instanceof Generalization && (c.end === me.xmiId));
          return index !== idx && isRelated;
        })
        .map(c => c.startRef);
      return this._subTypes;
    }
    return null;
  }

  get superType(): Classification {
    const me = this;
    if (this.generalization) {
      if (this.generalization.length > 1) {
        throw new Error('Class has more than one super type');
      }
      return (<Generalization>this.generalization[0]).generalRef;
    }
    return null;
  }

  // Properties for rendering
  width = 0;
  height = 30;

  constructor() {
    super();
  }

  public isVisible(noSuper?: boolean): boolean {
    const str = EABaseClass.service.searchString;
    if (str && str.length > 0) {
      if (str === this._lastSearch) { return this._isVisible; }
      const meVisible = super.isVisible();
      const typeVisible = this.match(this.type);
      const typeDescVisible = this.match(this.typeDesc);

      const sub = this.subTypes;
      const subVisible = (sub ? sub.some(s => s.match(s.name)) : meVisible);

      const t = this.superType;
      const superVisible = (t ? t.match(t.name) : meVisible);

      const m = this.members;
      const membersVisible = (m && m.length ? m.some(member => member ? member.isVisible() : false) : meVisible);

      const a = this.associations;
      const assocVisible = (a && a.length ? a.some(assoc => assoc ? assoc.getAssociationEnd(this).isVisible : false) : meVisible);

      this._lastSearch = str;
      this._isVisible = (meVisible || typeVisible || typeDescVisible || membersVisible || assocVisible || superVisible || subVisible);
      return this._isVisible;
    }
    return true;
  }
  findMember(id) {
    for (let j = 0; j < this.members.length; j++) {
      if (this.members[j].id === id) {
        return this.members[j];
      }
    }
    return null;
  }

}
