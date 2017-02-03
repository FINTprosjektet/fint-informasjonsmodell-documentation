import { ModelService } from '../model.service';
import * as merge from 'lodash/merge';
import * as map from 'lodash/map';
import * as keyBy from 'lodash/keyBy';
import * as mapValues from 'lodash/mapValues';

/**
 *
 *
 * @export
 * @class EABaseClass
 */
export class EABaseClass {
  static service: ModelService;

  xmiId: string;
  xmiType: string;
  name: string;
  visibility: string;

  parent: EABaseClass;

  comments: EABaseClass[];

  static createMatrix(elm) {
    const converter = EABaseClass.makeAbsoluteContext(elm);
    const margin = 5;
    const bbox = elm.getBBox();
    const xLeft = bbox.x - margin;
    const xCenter = bbox.x + (bbox.width / 2);
    const xRight = bbox.x + bbox.width + margin;
    const yTop = bbox.y - margin;
    const yMid = bbox.y + (bbox.height / 2);
    const yBot = bbox.y + bbox.height + margin;
    return {
      top: {
        left: converter(xLeft, yTop),
        center: converter(xCenter, yTop),
        right: converter(xRight, yTop)
      },
      mid: {
        left: converter(xLeft, yMid),
        center: converter(xCenter, yMid),
        right: converter(xRight, yMid)
      },
      bot: {
        left: converter(xLeft, yBot),
        center: converter(xCenter, yBot),
        right: converter(xRight, yBot)
      }
    };
  }

  static makeAbsoluteContext(element) {
    return function (x, y) {
      const offset = element.ownerSVGElement.getBoundingClientRect();
      const matrix = element.getScreenCTM();
      return {
        x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
        y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top
      };
    };
  }

  constructor() { }

  cleanId(str: string) {
    return str.toLowerCase().replace(/æ/, 'a').replace(/ø/, 'o').replace(/å/, 'a')
  }
}
