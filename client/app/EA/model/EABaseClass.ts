import { ModelService } from '../model.service';
import * as _ from 'lodash';

export class EABaseClass {
  static service: ModelService;

  protected json: {};
  xmlId: string;
  id: number;
  name: string;

  private _meta: {};
  get meta() { return this._meta; };
  set meta(meta: {}) { this._meta = _.merge(this._meta, meta); }

  static toMeta(json) {
    return _.chain(json)
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
      this.xmlId = json['_xmi.id'];
    }
    if (json['ModelElement.taggedValue']) {
      this.meta = EABaseClass.toMeta(json['ModelElement.taggedValue'].TaggedValue);
      this.id = this.meta['ea_localid'];
    }
  }

  find(comparator: Function) {
    let me = this;
    if (comparator(me)) { return me; }

    let obj;
    function match(o) {
      if (!obj && o instanceof EABaseClass) {
        if (comparator(o)) { obj = o; }
        else {
          let match = o.find(comparator);
          if (match) { obj = match; }
        }
      }
    }
    _.each(Object.keys(me), function (key) {
      if (!obj) {
        if (Array.isArray(me[key])) {
          _.each(me[key], match);
        } else {
          match(me[key]);
        }
      }
    });
    return obj;
  }

  findByXmlId(xmlId: string): EABaseClass {
    return this.find(function (obj: EABaseClass) {
      return (obj.xmlId === xmlId);
    });
  }

  findById(id: number): EABaseClass {
    return this.find(function (obj: EABaseClass) {
      return (obj.id === id);
    });
  }
}
