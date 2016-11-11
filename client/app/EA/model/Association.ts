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
  lineConfig: {};
  textConfig: {};

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

  renderLine(idx: number) {
    if (!this.lineConfig) {
      let source: Classification = <Classification>this.sourceType;
      let target: Classification = <Classification>this.targetType;
      this.lineConfig = {
        'x1': source.boxConfig['x'] + (source.boxConfig['width'] / 2),
        'y1': source.boxConfig['y'] + (source.boxConfig['height'] / 2),
        'x2': target.boxConfig['x'] + (target.boxConfig['width'] / 2),
        'y2': target.boxConfig['y'] + (target.boxConfig['height'] / 2),
      };
    }
    return this.lineConfig;
  }

  renderText(idx: number) {
    if (!this.textConfig) {
      this.textConfig = {
        'x': D3.max(this.lineConfig['x1'], this.lineConfig['x2']) - D3.min(this.lineConfig['x1'], this.lineConfig['x2']),
        'y': D3.max(this.lineConfig['y1'], this.lineConfig['y2']) - D3.min(this.lineConfig['y1'], this.lineConfig['y2']),
      };
    }
    return this.textConfig;
  }
}
