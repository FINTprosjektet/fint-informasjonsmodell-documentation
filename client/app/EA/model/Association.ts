import { EABaseClass } from './EABaseClass';
import { Connection } from './Connection';
import { Classification } from './Classification';
import * as D3 from '../../d3.bundle';

export class Association extends EABaseClass {
  source: Connection;
  target: Connection;
  _targetType: EABaseClass;
  _sourceType: EABaseClass;

  // Properties for rendering
  private _boxElement: SVGElement;
  get boxElement() { return this._boxElement; }
  set boxElement(elm: SVGElement) {
    this._boxElement = elm;
    this.render();
  }

  get sourceType(): EABaseClass {
    if (!this._sourceType && this.meta['ea_sourceID']) {
      this._sourceType = EABaseClass.service.findById(this.meta['ea_sourceID']);
    }
    return this._sourceType;
  }

  get targetType(): EABaseClass {
    if (!this._targetType && this.meta['ea_targetID']) {
      this._targetType = EABaseClass.service.findById(this.meta['ea_targetID']);
    }
    return this._targetType;
  }

  constructor(json: any, parent: EABaseClass) {
    super(json, parent);
    let connections: Connection[];
    if (Array.isArray(json['Association.connection'].AssociationEnd)) {
      connections = json['Association.connection'].AssociationEnd.map(conn => new Connection(conn, this));
    } else {
      connections = [new Connection(json['Association.connection'].AssociationEnd, this)];
    }
    if (connections.length > 2) {
      throw 'Unmatched connection length: ' + connections.length;
    }
    connections.forEach(conn => {
      if (conn.meta['ea_end'] === 'source') {
        this.source = conn;
      } else {
        this.target = conn;
      }
    });
  }

  render() {
    D3.select(this.boxElement)
      .attr('class', 'association source_' + this.sourceType.xmlId + ' target_' + this.targetType.xmlId)
      .append('path');

    D3.select(this.boxElement)
      .append('text')
      .text((d: Association) => d.target.multiplicity);
  }

  update() {
    let source: Classification = <Classification>this.sourceType;
    let target: Classification = <Classification>this.targetType;
    let sourceAbs = source.getAbsolutePosition();
    let targetAbs = target.getAbsolutePosition();

    let lineData: [number, number][] = this.calculatePathTo(sourceAbs, targetAbs);
    let line = D3.line()
      .curve(D3.curveNatural);

    D3.select(this.boxElement.querySelector('path'))
      .attr('d', line(lineData));
    /*
        D3.select(this.boxElement.querySelector('text'))
          .attrs({
            'x': (sourceAbs.x + targetAbs.x) / 2,
            'y': (sourceAbs.y + targetAbs.y) / 2,
          });
    */
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
