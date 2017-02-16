import { MarkdownToHtmlPipe } from 'markdown-to-html-pipe';
import { document } from '@angular/platform-browser/src/facade/browser';

import { EABaseClass } from './EABaseClass';
import { EANodeContainer } from './EANodeContainer';
import { EANode } from './EANode';
import { Stereotype } from './Stereotype';
import { Package } from './Package';
import { Generalization } from './Generalization';
import { Association } from './Association';
import { Attribute } from './Attribute';
import * as D3 from 'app/d3.bundle';
import * as each from 'lodash/each';

export class Classification extends EANode {
  static markPipe = new MarkdownToHtmlPipe();
  static umlId = 'uml:Class';

  xmiId: string;
  extension: any;
  referredBy: any[];
  generalization: any;
  ownedAttribute: Attribute[];
  isAbstract;

  _id: string;
  get id(): string {
    if (!this._id) {
      const pkgName = (this.parentPackage ? this.parentPackage.name : '');
      this._id = this.cleanId(pkgName + '_' + this.name);
    }
    return this._id;
  }

  private _isVisible: boolean;
  private _lastSearch: string;
  public isVisible(noSuper?: boolean): boolean {
    const str = EABaseClass.service.searchString;
    if (str && str.length > 0) {
      if (str == this._lastSearch) { return this._isVisible; }
      const meVisible = super.isVisible();
      const typeVisible = this.match(this.type);

      const sub = this.subTypes;
      const subVisible = (sub ? sub.some(s => s.match(s.name)) : meVisible);

      const t = this.superType;
      const superVisible = (t ? t.match(t.name) : meVisible);

      const m = this.members;
      const membersVisible = (m && m.length ? m.some(member => member.isVisible()) : meVisible);

      this._lastSearch = str;
      this._isVisible = (meVisible || typeVisible || membersVisible || superVisible || subVisible);
      return this._isVisible;
    }
    return true;
  }

  get members(): Attribute[] {
    return this.ownedAttribute;
  }

  findMember(id) {
    for (let j = 0; j < this.members.length; j++) {
      if (this.members[j].id == id) {
        return this.members[j];
      }
    }
    return null;
  }

  get isBaseClass(): boolean {
    if (this.extension && this.extension.project && this.extension.project.length) {
      const meta = this.extension.project[0];
      if (meta.keywords) {
        return meta.keywords.indexOf('hovedklasse') > -1;
      }
    }
    return false;
  }

  get type(): string {
    if (this.isAbstract === 'true') { return 'abstract'; }
    if (this.extension && this.extension.properties && this.extension.properties.length) {
      const meta = this.extension.properties[0];
      return meta.stereotype || meta.sType || meta.xmiType.substr('uml:'.length);
    }
    return 'table';
  }

  get documentation(): string {
    if (this.extension && this.extension.properties) {
      return this.extension.properties.map(e => e.documentation).join('');
    }
    return '';
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
  width: number = 0;
  height: number = 30;

  constructor() {
    super();
  }

  _calculatedWidth: number;
  calculatedWidth(): number {
    if (!this._calculatedWidth) {
      const box = D3.select(this.boxElement)
        .append('text')
        .text(this.name);
      const el = (<SVGGElement>box.node());
      this._calculatedWidth = el.getBBox().width + 20;
      if (el.remove) { el.remove(); }
      else { el.parentNode.removeChild(el); } // Supporting IE
    }
    return this._calculatedWidth;
  }

  addClass(elm: SVGGElement, className: string) {
    if (elm) {
      if (elm.classList) { elm.classList.add(className); }
      else if (!(new RegExp('(\\s|^)' + className + '(\\s|$)').test(elm.getAttribute('class')))) {
        elm.setAttribute('class', elm.getAttribute('class') + ' ' + className);
      }
    }
  }

  removeClass(elm: SVGGElement, className: string) {
    if (elm) {
      if (elm.classList) { elm.classList.remove(className); }
      else {
        const removedClass = elm.getAttribute('class').replace(new RegExp('(\\s|^)' + className + '(\\s|$)', 'g'), '$2');
        if (new RegExp('(\\s|^)' + className + '(\\s|$)').test(elm.getAttribute('class'))) {
          elm.setAttribute('class', removedClass);
        }
      }
    }
  }

  render() {
    const me = this;
    // Add class and id attributes to box element
    const classNames = ['element', this.type.toLowerCase()];
    const container = D3.select(this.boxElement);
    if (this.isBaseClass) { classNames.push('mainclass'); }
    container
      .attrs({ 'class': classNames.join(' '), 'id': this.xmiId })
      .on('mouseover', function () {
        each(document.querySelectorAll('.source_' + me.xmiId), elm => {
          me.addClass(elm, 'over'); me.addClass(elm, 'source');
          D3.select(elm.querySelector('path')).attr('marker-end', 'url(#arrow_source)');
        });
        each(document.querySelectorAll('.target_' + me.xmiId), elm => {
          me.addClass(elm, 'over'); me.addClass(elm, 'target');
          D3.select(elm.querySelector('path')).attr('marker-end', 'url(#arrow_target)');
        });
      })
      .on('mouseout', function () {
        each(document.querySelectorAll('.source_' + me.xmiId + ', .target_' + me.xmiId), elm => {
          me.removeClass(elm, 'over'); me.removeClass(elm, 'source'); me.removeClass(elm, 'target');
          D3.select(elm.querySelector('path')).attr('marker-end', 'url(#arrow_neutral)');
        });
      })
      .append('title').text(d => me.documentationHeader);

    // Calculate width of box based on text width
    me.width = me.calculatedWidth();

    // Add a rect
    container
      .append('rect')
      .attrs({ x: 0, y: 0, rx: 5, ry: 5, width: this.width, height: this.height });

    // Add a header
    container
      .append('text')
      .text(this.name)
      .attrs({ x: 10, y: 20 });
  }

  update() {
    if (this.boxElement) { // No need to update if this is not rendered
      const parent = this.parentPackage;
      const previous = this.getPrevious();

      const container = D3.select(this.boxElement);
      container.select('rect').attrs({ x: this.x, y: this.y });
      container.select('text').attrs({ x: this.x + 10, y: this.y + 20 });
    }
  }
}
