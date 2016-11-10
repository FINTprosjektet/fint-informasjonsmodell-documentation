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
  private static match(o, comparator, search) {
    if (!search.obj && o instanceof EABaseClass) {
      if (comparator(o)) { search.obj = o; }
      else {
        let m = o.find(comparator);
        if (m) { search.obj = m; }
      }
    }
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

    let search = {
      obj: null
    };
    _.each(Object.keys(me), function (key) {
      if (!search.obj) {
        if (Array.isArray(me[key])) {
          _.each(me[key], o => EABaseClass.match(o, comparator, search));
        } else {
          EABaseClass.match(me[key], comparator, search);
        }
      }
    });
    return search.obj;
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
