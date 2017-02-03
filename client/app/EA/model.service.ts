import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
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
  version: string = 'master'; // Default branch
  cachedModel: Model;

  modelObservable: Observable<Model>;
  modelData: Model;

  // Filter
  private oldFilter: string = '';
  _searchString: string = '';
  get searchString(): string { return this._searchString; }
  set searchString(value: string) {
    this._searchString = value;
    //this.filterModel(value);
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

  /**
   *
   *
   * @returns {Promise<Model>}
   *
   * @memberOf ModelService
   */
  fetchModel(): Observable<Model> {
    const me = this;

    me.isLoading = true;
    if (!me.modelObservable) {
      me.modelObservable = me.http.request(`/api/doc/${this.version}/json`)
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
    const retArr = [];
    const models = this.mapper.generatedModel[Model.umlId][0].packagedElement[0].packagedElement;
    models.forEach(model => {
      model.packagedElement.forEach(pkg => {
        if (pkg instanceof Package) {
          retArr.push(pkg);
        }
      });
    });
    return retArr;
  }

  handleError(error: any) {
    this.fintDialog.displayHttpError(error);
    return Observable.throw(error);
  }
}
