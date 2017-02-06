import { EABaseClass } from './EABaseClass';
import { EALinkBase } from './EALinkBase';
import { Classification } from './Classification';
import * as D3 from 'app/d3.bundle';
import * as each from 'lodash/each';

export class Association extends EALinkBase {
  static umlId = 'uml:Association';
  parent: any;

  start: string;
  end: string;
  get startRef(): any { return EABaseClass.service.mapper.flatModel[this.start]; }
  get endRef(): any { return EABaseClass.service.mapper.flatModel[this.end]; }

  // Properties for rendering
  private _boxElement: SVGElement;
  get boxElement() { return this._boxElement; }
  set boxElement(elm: SVGElement) {
    this._boxElement = elm;
    this.render();
  }

  constructor() {
    super();
  }

  render() {
    D3.select(this.boxElement)
      .attr('class', 'association source_' + this.startRef.xmiId + ' target_' + this.endRef.xmiId)
      .append('path')
      .attr('marker-end', 'url(#arrow_neutral)');
  }

  update() {
    const lineData: [number, number][] = this.calculatePathTo(this.startRef, this.endRef);
    const line = D3.line()
      .curve(D3.curveNatural);

    D3.select(this.boxElement.querySelector('path'))
      .attr('d', line(lineData));
  }
}
