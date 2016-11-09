import { ReadModelService } from '../read-model.service';
import { chain, map, keyBy, merge, mapValues } from 'lodash';

export class EABaseClass {
  static service: ReadModelService;

  private json: {};
  id: string;
  name: string;

  private _meta: {};
  get meta() { return this._meta; };
  set meta(meta: {}) { this._meta = merge(this._meta, meta); }

  static toMeta(json) {
    return chain(json)
      .map(function (tagValue) { return { tag: tagValue['_tag'], value: tagValue['_value'] }; })
      .keyBy('tag')
      .mapValues(function (tag) { return tag['value']; })
      .value();
  }

  constructor(json: {}) {
    this.json = json;
    if (json['_name']) {
      this.name = json['_name'];
    }
    if (json['_xmi.id']) {
      this.id = json['_xmi.id'];
    }
    if (json['ModelElement.taggedValue']) {
      this.meta = EABaseClass.toMeta(json['ModelElement.taggedValue'].TaggedValue);
    }
  }

  /**
   * Default implementation. Should be overridden.
   *
   * @param {string} xmlId
   * @returns
   *
   * @memberOf EABaseClass
   */
  findById(xmlId: string): EABaseClass {
    if (this.id === xmlId) { return this; }
    return null;
  }

  protected filterChildren(children: EABaseClass[], xmlId: string) {
    if (children) {
      let match = children.filter(c => c.findById(xmlId));
      if (match.length === 1) {
        return match[0];
      } else if (match.length > 1) {
        throw 'xml id matches more than one element';
      }
    }
    return null;
  }
}
