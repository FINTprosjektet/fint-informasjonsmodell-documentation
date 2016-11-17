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

  private _meta: {};
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

  makeAbsoluteContext(element) {
    return function (x, y) {
      let offset = element.ownerSVGElement.getBoundingClientRect();
      let matrix = element.getScreenCTM();
      return {
        x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
        y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top
      };
    };
  }
}
