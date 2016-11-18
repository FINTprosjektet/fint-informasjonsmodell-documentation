import { ModelService } from '../model.service';
import { merge, map, keyBy, mapValues } from 'lodash';

/**
 *
 *
 * @export
 * @class EABaseClass
 */
export class EABaseClass {
  static service: ModelService;

  protected json: {};
  parent: EABaseClass;
  xmlId: string;
  id: number;
  name: string;
  visibility: string;

  protected _meta: {};
  get meta() { return this._meta; };
  set meta(meta: {}) { this._meta = merge(this._meta, meta); }

  /**
   *
   *
   * @static
   * @param {any} json
   * @returns
   *
   * @memberOf EABaseClass
   */
  static toMeta(json) {
    return mapValues(
      keyBy(
        map(json, function (tagValue) {
          return { tag: tagValue['_tag'], value: tagValue['_value'] };
        }), 'tag'), function (tag) {
          return tag['value'];
        }
    );
  }

  static createMatrix(elm) {
    let converter = EABaseClass.makeAbsoluteContext(elm);
    let margin = 5;
    let bbox = elm.getBBox();
    let xLeft = bbox.x - margin;
    let xCenter = bbox.x + (bbox.width / 2);
    let xRight = bbox.x + bbox.width + margin;
    let yTop = bbox.y - margin;
    let yMid = bbox.y + (bbox.height / 2);
    let yBot = bbox.y + bbox.height + margin;
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
      let offset = element.ownerSVGElement.getBoundingClientRect();
      let matrix = element.getScreenCTM();
      return {
        x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
        y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top
      };
    };
  }

  /**
   * Creates an instance of EABaseClass.
   *
   * @param {{}} json
   * @param {EABaseClass} parent
   *
   * @memberOf EABaseClass
   */
  constructor(json: {}, parent: EABaseClass) {
    this.json = json;
    this.parent = parent;
    if (json['_name']) {
      this.name = json['_name'];
    }
    if (json['_xmi.id']) {
      this.xmlId = json['_xmi.id'];
    }
    if (json['ModelElement.taggedValue']) {
      this.meta = EABaseClass.toMeta(json['ModelElement.taggedValue'].TaggedValue);
      this.id = this.meta['ea_localid'];
    }

    this.visibility = json['_visibility'];
    EABaseClass.service.register(this);
  }
}
