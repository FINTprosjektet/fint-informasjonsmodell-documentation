import { EABaseClass } from './EABaseClass';
import { EALinkBase } from './EALinkBase';
import { Classification } from './Classification';
import * as D3 from 'app/d3.bundle';

export class Generalization extends EALinkBase {
  static umlId = 'uml:Generalization';

  general: string;
  get generalRef(): any { return EABaseClass.service.mapper.flatModel[this.general]; }

  constructor() {
    super();
  }
}
