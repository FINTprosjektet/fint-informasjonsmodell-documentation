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
  json: {};
  cachedModel: Model;

  constructor(private http: Http, private sanitizer: DomSanitizer) {
  }

  loadAndParseModel(): Observable<Model> {
    let me = this;
    EABaseClass.service = this;

    //let url = 'https://rawgit.com/FINTprosjektet/fint-informasjonsmodell/master/FINT-informasjonsmodell.xml';
    let url = '/assets/FINT-informasjonsmodell.xml';
    return this.http.request(url)
      .map(function (res: Response) {
        // Map to our model structure
        me.json = new X2JS().xml2js(res.text()).XMI['XMI.content']['Model'];
        let m = me.parseModel();
        console.log(m);
        return m;
      });
  }

  parseModel() {
    this.cachedModel = new Model(this.json);

    return this.cachedModel;
  }

  findByXmlId(xmlId: string): EABaseClass {
    return this.cachedModel.findByXmlId(xmlId);
  }

  findById(id: number): EABaseClass {
    return this.cachedModel.findById(id);
  }
}
