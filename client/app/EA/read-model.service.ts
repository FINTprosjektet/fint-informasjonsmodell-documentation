import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Model } from './model/Model';

declare const X2JS: any; // Global module

@Injectable()
export class ReadModelService {
  constructor(private http: Http, private sanitizer: DomSanitizer) {
  }

  getModel(): Observable<Model> {
    let headers = new Headers();
    let url = '/assets/FINT-informasjonsmodell.xml'; // 'https://raw.githack.com/FINTprosjektet/fint-informasjonsmodell/master/FINT-informasjonsmodell.xml';
    headers.append('Accept', 'application/xml');
    return this.http.get(url, { headers: headers })
      .map(function (res: Response) {
        // Map to our model structure
        let json = new X2JS().xml2js(res.text()).XMI['XMI.content']['Model'];
        let model = new Model(json);
        console.log(model);
        return model;
      });
  }
}
