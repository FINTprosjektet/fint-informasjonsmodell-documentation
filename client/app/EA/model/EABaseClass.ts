import { ModelService } from '../model.service';
import { each, merge, map, keyBy, mapValues } from 'lodash';

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

  private static match(o: EABaseClass, comparator: Function, search: { obj: EABaseClass }, parent: EABaseClass) {
    if (!search.obj && o instanceof EABaseClass) {
      if (comparator(o)) { search.obj = o; }
      else {
        let m = o.find(comparator, parent);
        if (m) { search.obj = m; }
      }
    }
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
  }

  /**
   *
   *
   * @param {Function} comparator
   * @param {EABaseClass} [parent]
   * @returns
   *
   * @memberOf EABaseClass
   */
  find(comparator: Function, parent?: EABaseClass) {
    let me = this;
    if (comparator(me)) { return me; }

    let search = {
      obj: null
    };
    each(Object.keys(me), function (key) {
      if (!search.obj && me[key] !== parent && key !== 'parent' && key !== 'container' && key !== 'allClasses') {
        if (Array.isArray(me[key])) {
          each(me[key], o => EABaseClass.match(o, comparator, search, me));
        } else {
          EABaseClass.match(me[key], comparator, search, me);
        }
      }
    });
    return search.obj;
  }

  /**
   *
   *
   * @param {string} xmlId
   * @returns {EABaseClass}
   *
   * @memberOf EABaseClass
   */
  findByXmlId(xmlId: string): EABaseClass {
    return this.find(function (obj: EABaseClass) {
      return (obj.xmlId === xmlId);
    }, this);
  }

  /**
   *
   *
   * @param {number} id
   * @returns {EABaseClass}
   *
   * @memberOf EABaseClass
   */
  findById(id: number): EABaseClass {
    return this.find(function (obj: EABaseClass) {
      return (obj.id === id);
    }, this);
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
