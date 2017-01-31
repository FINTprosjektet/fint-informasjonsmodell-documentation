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
  model = null;
  private gotoRetries: number = 0;

  isLoading: boolean = false;

  constructor(private modelService: ModelService, private route: ActivatedRoute, private titleService: Title) { }

  ngOnInit() {
    const me = this;
    me.titleService.setTitle('FINT | docs');
    this.isLoading = true;
    this.modelService.fetchModel().subscribe(model => {
      me.model = me.modelService.getTopPackages();
      this.isLoading = false;
    });
  }

  ngAfterViewInit() {
    // Detect fragments and navigate
    this.route.fragment.subscribe(xmiId => this.goto(xmiId));
  }

  private goto(xmiId) {
    if (xmiId) {
      this.modelService.searchString = '';
      let elm = document.querySelector('#' + xmiId);
      if (elm) {                            // Element exists; scroll to it
        elm.scrollIntoView();
        this.gotoRetries = 0;
      } else if (this.gotoRetries < 5) {    // Element not found; retry max 5 times
        this.gotoRetries++;
        setTimeout(() => this.goto(xmiId));
      } else {                              // Giving up. Reset counter and die
        this.gotoRetries = 0;
      }
    } else {
      // Goto top
      document.body.scrollIntoView();
    }
  }
}
