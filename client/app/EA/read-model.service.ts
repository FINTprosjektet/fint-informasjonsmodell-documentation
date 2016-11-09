import { EABaseClass } from './model/EABaseClass';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Model } from './model/Model';

declare const X2JS: any; // Global module

@Injectable()
export class ReadModelService {
  cachedModel: Model;
  modelObserver: Observable<Model>;

  constructor(private http: Http, private sanitizer: DomSanitizer) {
  }

  getModel(): Observable<Model> {
    let me = this;
    EABaseClass.service = this;

    if (this.modelObserver) { return this.modelObserver; }

    //let url = 'https://rawgit.com/FINTprosjektet/fint-informasjonsmodell/master/FINT-informasjonsmodell.xml';
    let url = '/assets/FINT-informasjonsmodell.xml';
    this.modelObserver = this.http.request(url)
      .map(function (res: Response) {
        // Map to our model structure
        let json = new X2JS().xml2js(res.text()).XMI['XMI.content']['Model'];
        let model = new Model(json);
        console.log(model);
        me.cachedModel = model;
        return model;
      });
    return this.modelObserver;
  }

  findByXmlId(xmlId: string): EABaseClass {
    return this.cachedModel.findByXmlId(xmlId);
  }

  findById(id: number): EABaseClass {
    return this.cachedModel.findById(id);
  }
}
