import { EABaseClass } from './EABaseClass';
import { Connection } from './Connection';
import { Classification } from './Classification';
import * as D3 from '../../d3.bundle';
import { each } from 'lodash';

export class Generailzation extends EABaseClass {
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
      .attr('class', 'generalization source_' + this._superType + ' target_' + this._subType)
      .append('path');
  }

  update() {
    let source: Classification = <Classification>this.superType;
    let target: Classification = <Classification>this.subType;
    let sourceAbs = source.getAbsolutePosition();
    let targetAbs = target.getAbsolutePosition();

    let lineData: [number, number][] = this.calculatePathTo(sourceAbs, targetAbs);
    let line = D3.line()
      .curve(D3.curveNatural);

    D3.select(this.boxElement.querySelector('path'))
      .attr('d', line(lineData));
  }

  calculatePathTo(source, target): [number, number][] {
    let xMiddle = ((source.x + target.x) / 2);
    let yMiddle = ((source.y + target.y) / 2);
    let xExtra; let yExtra;
    if (xMiddle === source.x && yMiddle === source.y) {
      xExtra = xMiddle - 50;
      yExtra = yMiddle + 50;
    }
    if (xMiddle === source.x) { xMiddle += 50; }
    if (yMiddle === source.y) { yMiddle += 50; }
    if (xExtra && yExtra) {
      return [
        [source.x, source.y],
        [xMiddle, yMiddle],
        [xExtra, yExtra],
        [target.x, target.y]
      ];
    }
    return [
      [source.x, source.y],
      [xMiddle, yMiddle],
      [target.x, target.y]
    ];
  }
}
