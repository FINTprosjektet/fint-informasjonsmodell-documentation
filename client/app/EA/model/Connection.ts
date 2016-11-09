import { EABaseClass } from './EABaseClass';

export class Connection extends EABaseClass {
  aggregation: string;
  isOrdered: boolean;
  targetScope: string;
  changeable: string;
  type: string;
  multiplicity: string;

  get parent() {
    if (this.type) {
      return EABaseClass.service.findByXmlId(this.type);
    }
    return null;
  }

  constructor(json: any) {
    super(json);
    this.aggregation = json['_aggregation'];
    this.isOrdered = json['_isOrdered'];
    this.targetScope = json['_targetScope'];
    this.changeable = json['_changeable'];
    this.multiplicity = json['_multiplicity'];
    this.type = json['_type'];
  }
}
