import { Component, OnInit } from '@angular/core';

import { Model } from './EA/model/Model';
import { ModelService } from './EA/model.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  model = null;
  isLoading = true;
  menu = null;

  get searchValue(): string { return this.modelService.searchString; }
  set searchValue(value: string) {
    this.modelService.searchString = value;
    this.filterModel(this.modelService.searchString);
  }

  constructor(private modelService: ModelService) { }

  ngOnInit() {
    this.loadModel();
  }

  filterModel(filter?: string) {
    this.model = this.modelService.parseModel();
    if (filter) {
      this.model = this.model.filter(filter);
    }
  }

  loadModel() {
    let me = this;
    this.modelService.loadAndParseModel().subscribe(function (model: Model) {
      me.isLoading = false;
      me.model = model;
      me.menu = model.package.stereotypes;
    });
  }
}
