import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AfterViewInit, Component, OnInit } from '@angular/core';

import { ModelService } from '../../EA/model.service';
import { Model } from '../../EA/model/Model';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, AfterViewInit {
  private menu = null;
  private gotoRetries: number = 0;

  get model(): Model { return this.modelService.cachedModel; }
  get isLoading() { return this.modelService.isLoading; }

  constructor(private modelService: ModelService, private route: ActivatedRoute, private titleService: Title) { }

  ngOnInit() {
    let me = this;
    me.titleService.setTitle('FINT | api');

    this.modelService.fetchModel().then(function () {
      me.menu = me.modelService.cachedModel.package.stereotypes;
    });
  }

  ngAfterViewInit() {
    // Detect fragments and navigate
    this.route.fragment.subscribe(xmlId => this.goto(xmlId));
  }

  private goto(xmlId) {
    if (xmlId) {
      this.modelService.searchString = '';
      let elm = document.querySelector('#' + xmlId);
      if (elm) {                            // Element exists; scroll to it
        elm.scrollIntoView();
        this.gotoRetries = 0;
      } else if (this.gotoRetries < 5) {    // Element not found; retry max 5 times
        this.gotoRetries++;
        setTimeout(() => this.goto(xmlId));
      } else {                              // Giving up. Reset counter and die
        this.gotoRetries = 0;
      }
    } else {
      // Goto top
      document.body.scrollIntoView();
    }
  }
}
