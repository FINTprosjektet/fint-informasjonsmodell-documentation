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
    return str.toLowerCase().replace(/æ/gi, 'a').replace(/ø/gi, 'o').replace(/å/gi, 'a').replace(' ', '_');
  }

  public isVisible(): boolean {
    const str = EABaseClass.service.searchString;
    if (str && str.length > 0) {
      const hasType = this.match(this.xmiType);
      const hasName = this.match(this.name);

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
