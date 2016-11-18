import { EABaseClass } from './EABaseClass';
import { EALinkBase } from './EALinkBase';
import { Classification } from './Classification';
import * as D3 from '../../d3.bundle';

export class Generailzation extends EALinkBase {
  _superType: string;
  _subType: string;
  _super: Classification;
  get superType(): Classification {
    if (!this._super && this._superType) {
      this._super = <Classification>EABaseClass.service.findByXmlId(this._superType);
    }
    return this._super;
  }
  _sub: Classification;
  get subType(): Classification {
    if (!this._sub && this._subType) {
      this._sub = <Classification>EABaseClass.service.findByXmlId(this._subType);
    }
    return this._sub;
  }

  // Properties for rendering
  private _boxElement: SVGElement;
  get boxElement() { return this._boxElement; }
  set boxElement(elm: SVGElement) {
    this._boxElement = elm;
    this.render();
  }

  constructor(json: any, parent: EABaseClass) {
    super(json, parent);
    this._superType = json['_supertype'];
    this._subType = json['_subtype'];
  }

  render() {
    D3.select(this.boxElement)
      .attr('class', 'generalization source_' + this._subType + ' target_' + this._superType)
      .append('path');
  }

  update() {
    let lineData: [number, number][] = this.calculatePathTo(this.subType, this.superType);
    let line = D3.line()
      .curve(D3.curveNatural);

    D3.select(this.boxElement.querySelector('path'))
      .attr('d', line(lineData));
  }
}
