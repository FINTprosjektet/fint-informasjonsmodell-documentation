import { EABaseClass } from './EABaseClass';

export class Comment extends EABaseClass {
  get type() { return this.xmiType; }

  constructor() {
    super();
  }

  render() { }
  update() { }
}
