import { Association } from './model/Association';
import { Generailzation } from './model/Generalization';
import { EABaseClass } from './model/EABaseClass';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { each } from 'lodash';
import { Model } from './model/Model';

declare const X2JS: any; // Global module

/**
 *
 *
 * @export
 * @class ModelService
 */
@Injectable()
export class ModelService {
  json: {};
  isLoading: boolean = false;
  cachedModel: Model;

  // Repository
  byXmlId = {};
  byId = {};

  // Promise resolve/reject methods
  modelPromise: Promise<Model>;
  private modelResolve;
  private modelReject;

  // Filter
  private oldFilter: string = '';
  _searchString: string = '';
  get searchString(): string { return this._searchString; }
  set searchString(value: string) {
    this._searchString = value;
    this.filterModel(value);
  }

  /**
   * Creates an instance of ModelService.
   *
   * @param {Http} http
   *
   * @memberOf ModelService
   */
  constructor(private http: Http) {
    EABaseClass.service = this;
  }

  /**
   *
   *
   * @returns {Promise<Model>}
   *
   * @memberOf ModelService
   */
  fetchModel(): Promise<Model> {
    let me = this;

    if (!this.modelPromise) {
      this.modelPromise = new Promise<Model>((resolve, reject) => {
        this.modelResolve = resolve;
        this.modelReject = reject;
      });
      let url = '/api/github/FINTprosjektet/fint-informasjonsmodell/master/FINT-informasjonsmodell.xml';
      me.isLoading = true;
      this.http.request(url)
        .map(function (res: Response) {
          // Map to our model structure
          me.json = new X2JS().xml2js(res.text()).XMI['XMI.content']['Model'];
          let m = me.parseModel();
          console.log(m);
          return m;
        })
        .subscribe(function (model: Model) {
          me.isLoading = false;
          me.modelResolve(model);
        });
    }

    // Reset model (if it allready is parsed)
    if (this.cachedModel) {
      this.parseModel();
    }
    return this.modelPromise;
  }

  getAllGeneralizations(): Generailzation[] {
    let generalizations: Generailzation[] = [];
    each(this.cachedModel.package.stereotypes, type => {
      generalizations = generalizations.concat(type.allGeneralizations);
    });
    return generalizations;
  }

  getAllAssociations(): Association[] {
    let associations: Association[] = [];
    each(this.cachedModel.package.stereotypes, type => {
      associations = associations.concat(type.allAssociations);
    });
    return associations;
  }

  private filterModel(filter?: string) {
    if (filter != this.oldFilter) { // Reset model
      this.cachedModel = this.parseModel().filter(filter);
      this.oldFilter = filter;
    }
  }

  /**
   *
   *
   * @returns
   *
   * @memberOf ModelService
   */
  parseModel() {
    this.byId = {};
    this.byXmlId = {};
    this.cachedModel = new Model(this.json, null);
    return this.cachedModel;
  }

  register(cls: EABaseClass) {
    if (cls.xmlId) { this.byXmlId[cls.xmlId] = cls; }
    if (cls.id) { this.byId[cls.id] = cls; }
  }

  /**
   *
   *
   * @param {string} xmlId
   * @returns {EABaseClass}
   *
   * @memberOf ModelService
   */
  findByXmlId(xmlId: string): EABaseClass {
    return this.byXmlId[xmlId];
  }

  /**
   *
   *
   * @param {number} id
   * @returns {EABaseClass}
   *
   * @memberOf ModelService
   */
  findById(id: number): EABaseClass {
    return this.byId[id];
  }
}
