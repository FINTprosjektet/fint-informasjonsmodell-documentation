import { ResourceLoader } from '@angular/compiler';
import { EABaseClass } from './EABaseClass';
import { Connection } from './Connection';

export class Association extends EABaseClass {
  source: Connection;
  target: Connection;

  constructor(json: any) {
    super(json);
    let connections: Connection[];
    if (Array.isArray(json['Association.connection'].AssociationEnd)) {
      connections = json['Association.connection'].AssociationEnd.map(conn => new Connection(conn));
    } else {
      connections = [new Connection(json['Association.connection'].AssociationEnd)];
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

  findById(xmlId: string): EABaseClass {
    if (this.id === xmlId) { return this; }
    return this.source.findById(xmlId) || this.target.findById(xmlId);
  }
}
