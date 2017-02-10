import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, Observer, ReplaySubject } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/catch';
import 'rxjs/observable/of';
import * as each from 'lodash/each';

import { FintDialogService } from 'fint-shared-components';

import { IMapper } from './mapper/IMapper';
import { XMLMapper } from './mapper/XMLMapper';
import { JSON_XMI21_Mapper } from './mapper/JSON_XMI21_Mapper';

import { EABaseClass } from './model/EABaseClass';
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

  private _version: string;
  private versionObserver: Observer<string>;
  public versionChanged: Observable<string> = new Observable(observer => this.versionObserver = observer);
  get version(): string {
    if (!this._version) { this.version = 'master'; }
    return this._version;
  }
  set version(value) {
    this._version = value;
    // Remove cache
    this.modelObservable = null;
    this.modelData = null;

    // Emit change
    if (this.versionObserver) {
      this.versionObserver.next(value);
    }
  }

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

  /**
   * Creates an instance of ModelService.
   *
   * @param {Http} http
   *
   * @memberOf ModelService
   */
  constructor(private http: Http, private fintDialog: FintDialogService) {
    EABaseClass.service = this;
    this.versionChanged.subscribe().unsubscribe(); // Just to register the observable
  }

  fetchVersions(): Observable<any> {
    return this.http.request('/api/doc/versions')
      .map(res => {
        const map = res.json().map(r => r.name);
        this.version = map[0];
        map.unshift('master'); // Add latest version to the top
        return map;
      })
      .catch(error => this.handleError(error));
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
            return me.modelData;
          } catch (ex) {
            console.error(ex);
          }
        })
        .share()
        .catch(error => this.handleError(error));
    }
    return me.modelObservable;
  }

  getGeneralizations(from?: any): any[] {
    return this.mapper.allOfXmiType(Generalization.umlId, from);
  }

  getAssociations(from?: any): any[] {
    return this.mapper.allOfXmiType(Association.umlId, from);
  }

  getClasses(from?: any): any[] {
    return this.mapper.allOfXmiType(Classification.umlId, from).filter(c => {
      return c.type !== 'Boundary';
    });
  }

  getTopPackages(from?: any): any[] {
    return this.model.packages;
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
