import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Model } from './EA/model/Model';
import { ModelService } from './EA/model.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  repos: any[];
  get selectedRepo(): string { return this.modelService.version; }
  set selectedRepo(value: string) { this.modelService.version = value; }

  get model(): Model { return this.modelService.model; }

  get searchValue(): string { return this.modelService.searchString; }
  set searchValue(value: string) {
    const currentPath = this.router.parseUrl(this.router.url).toString();
    this.modelService.searchString = value;
    if (value) {
      this.router.navigate(['/docs'], { queryParams: { s: value } });
    } else {
      this.router.navigate(['/docs']);
    }
  }

  constructor(
    private modelService: ModelService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('FINT');
    this.modelService.fetchBranches().subscribe(r => this.repos = r);
    this.route.queryParams.subscribe((params: any) => {
      if (params.s) {
        this.searchValue = params.s;
      }
    });
  }
}
