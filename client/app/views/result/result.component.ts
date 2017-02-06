import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ModelService } from '../../EA/model.service';
import { Model } from '../../EA/model/Model';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, AfterViewInit {
  model = null;
  modelResolve;
  modelReject;
  hasModel: Promise<any> = new Promise((resolve, reject) => {
    this.modelResolve = resolve;
    this.modelReject = reject;
  });
  get isLoading() { return this.modelService.isLoading; }
  set isLoading(flag) { this.modelService.isLoading = flag; }

  constructor(private modelService: ModelService, private route: ActivatedRoute, private titleService: Title) { }

  visiblePackages() {
    const packages = this.model.filter(pkg => pkg.isVisible());
    return packages;
  }

  ngOnInit() {
    this.titleService.setTitle('FINT | docs');
    this.isLoading = true;
    this.modelService.versionChanged.subscribe(v => this.loadData());
    this.loadData(); // Initial load
  }

  ngAfterViewInit() {
    // Detect query parameter from search string, and filter
    const me = this;
    this.route.params.subscribe((params: any) => {
      me.hasModel.then(() => me.goto(params.id));
    });
  }

  private loadData() {
    const me = this;
    this.modelService.fetchModel().subscribe(model => {
      me.model = me.modelService.getTopPackages();
      me.modelResolve();
      me.isLoading = false;
    });
  }

  private goto(id) {
    if (id) {
      this.modelService.searchString = '';
      setTimeout(() => {
        const elm = document.querySelector('#' + id);
        if (elm) { elm.scrollIntoView(true); }
      });
    } else { // Goto top
      document.body.scrollIntoView();
    }
  }
}
