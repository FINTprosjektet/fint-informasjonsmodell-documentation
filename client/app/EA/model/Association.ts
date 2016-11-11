import { EABaseClass } from './EABaseClass';
import { Connection } from './Connection';

export class Association extends EABaseClass {
  source: Connection;
  target: Connection;
  //_targetType: EABaseClass;
  //_sourceType: EABaseClass;
  /*
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
  */
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
}
