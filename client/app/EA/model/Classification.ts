import { document } from '@angular/platform-browser/src/facade/browser';

import { EABaseClass } from './EABaseClass';
import { Stereotype } from './Stereotype';
import { Package } from './Package';
import { Generalization } from './Generalization';
import { Association } from './Association';
import { Attribute } from './Attribute';
import * as D3 from '../../d3.bundle';
import * as each from 'lodash/each';

export class Classification extends EABaseClass {
  static umlId = 'uml:Class';

  xmiId: string;
  extension: any;
  parent: any;
  referredBy: any[];
  generalization: any;
  ownedAttribute: Attribute[];
  isAbstract;

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

  get id(): string {
    const pkgName = (this.package ? this.package.name : '');
    return this.cleanId(pkgName + '_' + this.name);
  }

  get package(): Package {
    let parent = this.parent;
    while (parent) {
      if (parent instanceof Package) { return parent; }
      parent = parent.parent;
    }
    return null;
  }

  get members(): Attribute[] {
    return this.ownedAttribute;
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
  private _boxElement: SVGGElement;
  get boxElement() { return this._boxElement; }
  set boxElement(elm: SVGGElement) {
    this._boxElement = elm;
    this.render();
  }
  x: number;
  y: number;
  width: number;
  height: number = 30;

  constructor() {
    super();
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
    D3.select(this.boxElement)
      .attr('class', 'element ' + this.type.toLowerCase())
      .attr('id', this.xmiId)
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
      });

    // Calculate width of box based on text width
    D3.select(this.boxElement)
      .append('text')
      .text(this.name)
      .each(function (d: Classification) {
        me.width = this.getBBox().width + 20;
        if (this.remove) {
          this.remove();
        } else {
          this.parentNode.removeChild(this); // Supporting IE
        }
      });

    // Add a rect
    D3.select(this.boxElement)
      .append('rect')
      .attrs({ x: 0, y: 0, rx: 5, ry: 5, width: this.width, height: this.height });

    // Add a header
    D3.select(this.boxElement)
      .append('text')
      .text(this.name)
      .attrs({ x: 10, y: 20 });
  }

  getPackage(): Package {
    let parent = this.parent;
    while (!parent.boxElement) { parent = parent.parent; } // Find closest _rendered_ parent
    return parent;
  }

  getPrevious(): Classification {
    const previous = this.boxElement.previousSibling;
    if (previous) {
      if (previous['__data__'] && previous['__data__'] instanceof Classification) {
        return previous['__data__'];
      }
    }
    return null;
  }

  update() {
    const idx = Array.prototype.indexOf.call(this.boxElement.parentNode.childNodes, this.boxElement);
    const parent = this.getPackage();
    const previous = this.getPrevious();

    this.x = (previous ? (previous.x + previous.width) : 0) + 15;
    this.y = (previous ? previous.y : 30);
    if (previous && (this.x + this.width) > parent.width) {
      // Fall down one line
      this.y = previous.y + 45;
      this.x = 15;
    }

    D3.select(this.boxElement)
      .attr('transform', `translate(${this.x}, ${this.y})`);
  }
}
