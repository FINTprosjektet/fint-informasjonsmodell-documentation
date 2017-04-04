import { EventEmitter, Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, Observer, ReplaySubject } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/catch';
import 'rxjs/observable/of';
import 'rxjs/observable/empty';

import { FintDialogService } from 'fint-shared-components';

import { IMapper } from './mapper/IMapper';
import { XMLMapper } from './mapper/XMLMapper';
import { JSON_XMI21_Mapper } from './mapper/JSON_XMI21_Mapper';

import { EABaseClass } from './model/EABaseClass';
import { EALinkBase } from './model/EALinkBase';
import { EANode } from './model/EANode';

import { Model } from './model/Model';
import { Package } from './model/Package';
import { Classification } from './model/Classification';
import { Association } from './model/Association';
import { Generalization } from './model/Generalization';

/**
 *
 *
 * @export
 * @class ModelService
 */
@Injectable()
export class ModelService {
  mapper: IMapper;
  isLoading: boolean = false;

  public defaultVersion: string;
  private _version: string;
  public versionChanged: EventEmitter<string> = new EventEmitter<string>();
  get version(): string {
    return this._version;
  }
  set version(value) {
    if (value != this._version) {
      this._version = value;
      // Remove cache
      this.modelObservable = null;
      this.modelData = null;
      this.hasModel = this.createModelPromise(); // Reset promise

      // Emit change
      this.versionChanged.emit(value);
    }
  }

  modelResolve;
  modelReject;
  hasModel: Promise<any> = this.createModelPromise();

  modelObservable: Observable<any>;
  modelData: any;
  get model(): Model {
    if (this.mapper && this.mapper.modelRoot) {
      return this.mapper.modelRoot.modelBase;
    }
    return null;
  };

  // Filter
  private _searchString: string = '';
  get searchString(): string { return this._searchString; }
  set searchString(value: string) {
    if (this._searchString != value) {
      this._searchString = value;
    }
  }

  get queryParams(): any {
    const qParam: any = {};
    if (this.searchString) { qParam.s = this.searchString; }
    if (this.version) { qParam.v = this.version; }
    return qParam;
  }

  /**
   * Creates an instance of ModelService.
   *
   * @param {Http} http
   *
   * @memberOf ModelService
   */
  constructor(private http: Http, private fintDialog: FintDialogService) {
    EABaseClass.service = this;
  }

  fetchVersions(): Observable<any> {
    return this.http.request('/api/doc/versions')
      .map(res => {
        let map = res.json();
        if (Array.isArray(map)) {
          map = map.map(r => r.name);
          this.defaultVersion = map[0];
          if (!this.version) { this.version = this.defaultVersion; }
          map.unshift('master'); // Add latest version to the top
          return map;
        }
        else { console.error(map); }
        return null;
      })
      .catch(error => this.handleError(error));
  }

  createModelPromise(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.modelResolve = resolve;
      this.modelReject = reject;
    });
  }

  /**
   *
   *
   * @returns {Promise<Model>}
   *
   * @memberOf ModelService
   */
  fetchModel(): Observable<any> {
    const me = this;

    me.isLoading = true;
    if (!me.modelObservable) {
      if (!this.version) {
        return Observable.empty();
      }
      me.modelObservable = me.http.request(`/api/doc/${this.version}`)
        .map(function (res: Response) {
          let contentType = res.headers.get('content-type');
          contentType = contentType.substr(0, contentType.indexOf(';'));
          switch (contentType) {
            case 'text/json': me.mapper = new JSON_XMI21_Mapper(res.json()); break;
            default: me.mapper = new XMLMapper(res.text()); break;
          }
          try {
            me.modelData = me.mapper.parse();
            me.modelObservable = Observable.of(me.modelData);
            console.log(me.modelData);
            setTimeout(() => me.modelResolve());
            return me.modelData;
          } catch (ex) {
            console.error(ex);
            me.modelReject();
          }
        })
        .share()
        .catch(error => this.handleError(error));
    }
    return me.modelObservable;
  }

  getLinkNodes(from?: any): EALinkBase[] {
    return this.getAssociations(from).concat(this.getGeneralizations(from));
  }

  getNodes(from?: any): EANode[] {
    let results: any[] = [];
    Object.keys(this.mapper.flatModel).forEach(key => {
      const model = this.mapper.flatModel[key];
      const props = model.extension && model.extension.properties ? model.extension.properties[0] : {stereotype: '', sType: ''};
      if (model instanceof EANode
        && (!props.stereotype || props.stereotype.toLowerCase() !== "xsdsimpletype")
        && (!props.sType || props.sType.toLowerCase() !== 'boundary')) {
        results.push(model);
      }
    });
    if (from) {
      results = results.filter(n => {
        let parent = n.parent;
        while (parent) {
          if (parent === from) { return true; }
          parent = parent.parent;
        }
        return false;
      });
    }

    return results;
  }

  getGeneralizations(from?: any): any[] {
    return this.mapper.allOfXmiType(Generalization.umlId, from).filter((g: Generalization) => {
      return g.source != null && g.target != null && g.source.type.toLowerCase() !== 'xsdsimpletype' && g.target.type.toLowerCase() !== 'xsdsimpletype';
    });
  }

  getAssociations(from?: any): any[] {
    return this.mapper.allOfXmiType(Association.umlId, from);
  }

  getClasses(from?: any): any[] {
    return this.mapper.allOfXmiType(Classification.umlId, from).filter((c: Classification) => c.type !== 'Boundary' && c.type.toLowerCase() !== 'xsdsimpletype');
  }

  getTopPackages(from?: any): any[] {
    return this.model.stereotypes;
  }

  getObjectById(id) {
    for (let key in this.mapper.flatModel) {
      const model = this.mapper.flatModel[key];
      if (model && model.id == id) {
        return model;
      }
    }
  }

  handleError(error: any) {
    console.error(error);
    this.fintDialog.displayHttpError(error);
    return Observable.throw(error);
  }
}
