import { MarkdownToHtmlPipe } from 'markdown-to-html-pipe';

import { EABaseClass } from './EABaseClass';
import { EALinkBase } from './EALinkBase';
import { Classification } from './Classification';

import { ExpandablePipe } from '../../views/result/pipes/expandable.pipe';

import * as D3 from 'app/d3.bundle';

export class Association extends EALinkBase {
  static pipe = new ExpandablePipe();
  static markPipe = new MarkdownToHtmlPipe()

  static umlId = 'uml:Association';
  parent: any;
  extension: any;

  isOpen = false;

  private _isVisible: boolean;
  private _lastSearch: string;
  public isAssocVisible(classification: Classification): boolean {
    const str = EABaseClass.service.searchString;
    if (str && str.length > 0) {
      if (str == this._lastSearch) { return this._isVisible; }
      const meVisible = super.isVisible();
      const typeVisible = this.match(this.getRouteLabel(classification));

      let labelVisible = false;
      if (this.start === this.end) {
        labelVisible = this.match(this.getLabel(classification));
      }
      labelVisible = labelVisible || this.match(this.getLabel(classification));

      this._lastSearch = str;
      this._isVisible = (meVisible || typeVisible || labelVisible);
      return this._isVisible;
    }
    return true;
  }

  get sourceDocumentation(): string { return this.getDocumentation('source'); }
  get targetDocumentation(): string { return this.getDocumentation('target'); }
  private getDocumentation(from) {
    return this.extension[from][0].documentation[0].value || '';
  }

  _sourceHeaderClean: string;
  _targetHeaderClean: string;
  get sourceDocumentationHeader(): string { return this.getDocHeader('source'); }
  get targetDocumentationHeader(): string { return this.getDocHeader('target'); }
  private getDocHeader(from) {
    if (!this[`_${from}HeaderClean`]) {
      const doc = this.getDocumentation(from);
      this[`_${from}HeaderClean`] = doc.indexOf('\n') > 0 ? doc.substr(0, doc.indexOf('\n')) : doc;
    }
    return this[`_${from}HeaderClean`];
  }

  _sourceDocBody: string;
  _targetDocBody: string;
  get sourceDocumentationBody(): string { return this.getDocBody('source'); }
  get targetDocumentationBody(): string { return this.getDocBody('target'); }
  private getDocBody(from) {
    if (!this[`_${from}DocBody`]) {
      const doc = this.getDocumentation(from);
      this[`_${from}DocBody`] = Association.markPipe.transform(doc.indexOf('\n') > 0 ? doc.substr(doc.indexOf('\n') + 1) : '');
    }
    return this[`_${from}DocBody`];
  }

  constructor() {
    super();
  }

  _lastClassHead: Classification;
  getDocumentationHeader(clas: Classification): string {
    let start = this.start !== this.end, end = this.start !== this.end;
    if (this.start === this.end) {
      if (!this._lastClassHead) { start = true; this._lastClassHead = clas; }
      else { end = true; this._lastClassHead = null; }
    }

    if (start && this.start === clas.xmiId) { return this.targetDocumentationHeader; }
    if (end && this.end === clas.xmiId) { return this.sourceDocumentationHeader; }
    return '';
  }

  _lastClassBody: Classification;
  getDocumentationBody(clas: Classification): string {
    let start = this.start !== this.end, end = this.start !== this.end;
    if (this.start === this.end) {
      if (!this._lastClassBody) { start = true; this._lastClassBody = clas; }
      else { end = true; this._lastClassBody = null; }
    }
    if (start && this.start === clas.xmiId) { return this.targetDocumentationBody; }
    if (end && this.end === clas.xmiId) { return this.sourceDocumentationBody; }
    return '';
  }

  getRouteTo(clas: Classification) {
    if (this.start === clas.xmiId) { return this.extension.target[0].reference.id; }
    if (this.end === clas.xmiId) { return this.extension.source[0].reference.id; }
  }
  getRouteLabel(clas: Classification) {
    if (this.start === clas.xmiId) { return this.extension.target[0].reference.name; }
    if (this.end === clas.xmiId) { return this.extension.source[0].reference.name; }
  }

  _lastClassLabel: Classification;
  getLabel(clas: Classification) {
    let start = this.start !== this.end, end = this.start !== this.end;
    if (this.start === this.end) {
      if (!this._lastClassLabel) { start = true; this._lastClassLabel = clas; }
      else { end = true; this._lastClassLabel = null; }
    }
    if (start && this.start === clas.xmiId && this.extension.target[0].role[0].name) {
      return this.extension.target[0].role[0].name;
    }
    if (end && this.end === clas.xmiId && this.extension.source[0].role[0].name) {
      return this.extension.source[0].role[0].name;
    }
    return '';
  }

  _lastClassMultiplicity;
  getMultiplicity(clas: Classification) {
    let start = this.start !== this.end, end = this.start !== this.end;
    if (this.start === this.end) {
      if (!this._lastClassMultiplicity) { start = true; this._lastClassMultiplicity = clas; }
      else { end = true; this._lastClassMultiplicity = null; }
    }
    if (start && this.start === clas.xmiId && this.extension.target[0].type[0].multiplicity) {
      return this.extension.target[0].type[0].multiplicity;
    }
    if (end && this.end === clas.xmiId && this.extension.source[0].type[0].multiplicity) {
      return this.extension.source[0].type[0].multiplicity;
    }
    return '';
  }
}
