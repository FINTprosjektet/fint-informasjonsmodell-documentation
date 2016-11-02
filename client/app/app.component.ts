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

  constructor(private readModel: ReadModelService) { }

  ngOnInit() {
    let me = this;
    this.readModel.getModel().subscribe(function (model: Model) {
      me.isLoading = false;
      me.model = model;
    });
  }
}
