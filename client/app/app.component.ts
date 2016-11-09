import { Component, OnInit } from '@angular/core';

import { Model } from './EA/model/Model';
import { ReadModelService } from './EA/read-model.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ReadModelService]
})
export class AppComponent implements OnInit {
  model = null;
  isLoading = true;
  _search: string = '';
  get searchValue(): string { return this._search; }
  set searchValue(value: string) {
    this._search = value;
    this.loadModel(this._search);
  }

  constructor(private readModel: ReadModelService) { }

  ngOnInit() {
    this.loadModel();
  }

  loadModel(filter?: string) {
    let me = this;
    this.readModel.getModel().subscribe(function (model: Model) {
      me.isLoading = false;
      if (filter) {
        model = model.filter(filter);
      }
      me.model = model;
    });
  }
}
