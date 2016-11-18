import { EABaseClass } from './EABaseClass';
import { EALinkBase } from './EALinkBase';
import { Connection } from './Connection';
import { Classification } from './Classification';
import * as D3 from '../../d3.bundle';
import { each } from 'lodash';

export class Association extends EALinkBase {
  source: Connection;
  target: Connection;
  _targetType: Classification;
  _sourceType: Classification;

  // Properties for rendering
  private _boxElement: SVGElement;
  get boxElement() { return this._boxElement; }
  set boxElement(elm: SVGElement) {
    this._boxElement = elm;
    this.render();
  }

  get sourceType(): Classification {
    if (!this._sourceType && this.meta['ea_sourceID']) {
      this._sourceType = <Classification>EABaseClass.service.findById(this.meta['ea_sourceID']);
    }
    return this._sourceType;
  }

  get targetType(): Classification {
    if (!this._targetType && this.meta['ea_targetID']) {
      this._targetType = <Classification>EABaseClass.service.findById(this.meta['ea_targetID']);
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
    each(connections, conn => {
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
      .append('path')
      .attr('marker-end', 'url(#arrow_neutral)');
  }

  update() {
    let lineData: [number, number][] = this.calculatePathTo(this.sourceType, this.targetType);
    let line = D3.line()
      .curve(D3.curveNatural);

    D3.select(this.boxElement.querySelector('path'))
      .attr('d', line(lineData));
  }
}
