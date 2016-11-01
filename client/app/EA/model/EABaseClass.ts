import * as _ from 'lodash';

export class EABaseClass {
  private json: {};
  id: string;
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
      this.id = json['_xmi.id'];
    }
    if (json['ModelElement.taggedValue']) {
      this.meta = EABaseClass.toMeta(json['ModelElement.taggedValue'].TaggedValue);
    }
  }
}
