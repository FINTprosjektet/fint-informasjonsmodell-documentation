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
    this.filterModel(this._search);
  }

  constructor(private readModel: ReadModelService) { }

  ngOnInit() {
    this.loadModel();
  }

  filterModel(filter?: string) {
    this.model = this.readModel.parseModel();
    if (filter) {
      this.model = this.model.filter(filter);
    }
  }

  loadModel() {
    let me = this;
    this.readModel.loadAndParseModel().subscribe(function (model: Model) {
      me.isLoading = false;
      me.model = model;
    });
  }
}
