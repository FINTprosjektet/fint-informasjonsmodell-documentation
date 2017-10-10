import { MarkdownToHtmlPipe } from 'markdown-to-html-pipe';

import { EABaseClass } from './EABaseClass';
import { EALinkBase } from './EALinkBase';
import { Classification } from './Classification';

import * as D3 from 'app/d3.bundle';

export class Association extends EALinkBase {
  static umlId = 'uml:Association';
  parent: any;
  extension: any;

  isOpen = false;

  _lastClass: Classification;

  constructor() {
    super();
  }

  getAssociationEnd(clas: Classification) {
    let start = this.start !== this.end, end = this.start !== this.end;
    if (this.start === this.end) {
      if (!this._lastClass) { start = true; this._lastClass = clas; }
      else { end = true; this._lastClass = null; }
    }
    if (start && this.start === clas.xmiId) { return this.extension.target[0]; }
    if (end && this.end === clas.xmiId) { return this.extension.source[0];}
  }
}
