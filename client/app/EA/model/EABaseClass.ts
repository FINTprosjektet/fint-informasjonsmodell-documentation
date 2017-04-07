import { HighlightPipe } from '../../views/result/pipes/highlight.pipe';
import { ModelService } from '../model.service';

/**
 *
 *
 * @export
 * @class EABaseClass
 */
export abstract class EABaseClass {
  static service: ModelService;
  static highlight: HighlightPipe = new HighlightPipe();

  xmiId: string;
  xmiType: string;
  name: string;
  visibility: string;

  parent: EABaseClass;
  comments: EABaseClass[];

  get queryParams() {
    return EABaseClass.service.queryParams;
  }

  constructor() { }

  cleanId(str: string) {
    return EABaseClass.service.cleanId(str);
  }

  public isVisible(): boolean {
    const str = EABaseClass.service.searchString;
    if (str && str.length > 0) {
      const hasType = this.match(this.xmiType);
      const hasName = this.name ? this.match(this.name) : false;

      return (hasType || hasName);
    }
    return true;
  }

  protected match(str: string): boolean {
    const search = EABaseClass.service.searchString;
    const regExp = new RegExp(EABaseClass.highlight.pattern(search), 'gi');
    const m = str.match(regExp);
    return m != null;
  }
}
