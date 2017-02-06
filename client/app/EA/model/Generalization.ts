import { EABaseClass } from './EABaseClass';
import { EALinkBase } from './EALinkBase';
import { Classification } from './Classification';
import * as D3 from 'app/d3.bundle';

export class Generalization extends EALinkBase {
  static umlId = 'uml:Generalization';

  start: string;
  end: string;
  general: string;
  get startRef(): any { return EABaseClass.service.mapper.flatModel[this.start]; }
  get endRef(): any { return EABaseClass.service.mapper.flatModel[this.end]; }
  get generalRef(): any { return EABaseClass.service.mapper.flatModel[this.general]; }

  // Properties for rendering
  private _boxElement: SVGElement;
  get boxElement() { return this._boxElement; }
  set boxElement(elm: SVGElement) {
    if (this.start) {
      this._boxElement = elm;
      this.render();
    }
  }

  constructor() {
    super();
  }

  render() {
    D3.select(this.boxElement)
      .attr('class', 'generalization source_' + this.startRef.xmiId + ' target_' + this.endRef.xmiId)
      .append('path');
  }

  update() {
    const lineData: [number, number][] = this.calculatePathTo(this.startRef, this.endRef);
    const line = D3.line()
      .curve(D3.curveNatural);

    D3.select(this.boxElement.querySelector('path'))
      .attr('d', line(lineData));
  }
}
