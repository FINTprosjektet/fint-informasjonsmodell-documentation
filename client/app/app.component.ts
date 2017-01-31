import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Model } from './EA/model/Model';
import { ModelService } from './EA/model.service';


@Component({
  selector: 'fint-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  get model(): Model { return this.modelService.cachedModel; }

  get searchValue(): string { return this.modelService.searchString; }
  set searchValue(value: string) {
    const currentPath = this.router.parseUrl(this.router.url).toString();
    if (currentPath.indexOf('docs') < 1) {
      this.router.navigate(['/docs']);
    }
    this.modelService.searchString = value;
  }

  constructor(
    private modelService: ModelService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('FINT');
  }
}
