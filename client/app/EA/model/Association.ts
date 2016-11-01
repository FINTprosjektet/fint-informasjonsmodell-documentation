import { EABaseClass } from './EABaseClass';
import { Connection } from './Connection';

export class Association extends EABaseClass {
  connections: Connection[];

  constructor(json: any) {
    super(json);
    if (Array.isArray(json['Association.connection'].AssociationEnd)) {
      this.connections = json['Association.connection'].AssociationEnd.map(conn => new Connection(conn));
    } else {
      this.connections = [new Connection(json['Association.connection'].AssociationEnd)];
    }
  }
}
