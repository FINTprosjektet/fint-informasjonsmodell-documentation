import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as D3 from 'app/d3.bundle';

import { ModelService } from 'app/EA/model.service';
import { IModelContainer, Model } from 'app/EA/model/Model';
import { Stereotype } from 'app/EA/model/Stereotype';
import { Classification } from 'app/EA/model/Classification';
import { Generalization } from 'app/EA/model/Generalization';
import { Association } from 'app/EA/model/Association';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit, AfterViewInit {
  @ViewChild('container') element: ElementRef;

  private model: IModelContainer;
  private host;
  private svg;
  private width;
  private height;
  private htmlElement: HTMLElement;

  types = [
    { name: 'Hoved klasse', type: 'mainclass' },
    { name: 'Klasse', type: 'class' },
    { name: 'Abstrakt', type: 'abstract' },
    { name: 'Data type', type: 'datatype' },
    { name: 'Opplisting', type: 'enumeration' },
    { name: 'Kodeliste', type: 'codelist' }
  ];

  get isLoading() { return this.modelService.isLoading; }
  set isLoading(flag) { this.modelService.isLoading = flag; }

  constructor(private modelService: ModelService, private router: Router, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Model | Fint');
  }

  ngAfterViewInit() {
    this.htmlElement = this.element.nativeElement;
    this.host = D3.select(this.htmlElement);

    // Load data and render
    this.modelService.searchString = '';
    this.modelService.versionChanged.subscribe(v => this.loadData());
    this.loadData(); // Initial load
  }

  loadData() {
    const me = this;
    this.isLoading = true;
    this.modelService.fetchModel().subscribe(model => {
      me.model = model;
      me.setup();
      me.render();
      me.isLoading = false;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize($event) {
    this.update();
  }

  private setup(): void {
    this.width = this.htmlElement.clientWidth;
    //    this.height = (this.model.package.stereotypes.length * 100);

    this.host.html('');
    this.svg = this.host.append('svg')
      .attr('class', 'diagram')
      .append('g')
      .attr('class', 'model')
      .attr('transform', 'translate(0,0)');
  }

  private render() {
    const me = this;
    // const defs = this.svg.append('defs');
    // defs.selectAll('marker')
    //   .data(['neutral', 'source', 'target'])
    //   .enter()
    //   .append('marker')
    //   .attrs({
    //     'id': d => 'arrow_' + d,
    //     'class': d => d,
    //     'refX': 6,
    //     'refY': 6,
    //     'markerWidth': 30,
    //     'markerHeight': 30,
    //     'orient': 'auto'
    //   })
    //   .append('path')
    //   .attr('d', 'M 0 0 12 6 0 12 3 6')
    //   .attr('class', 'arrowHead');

    // Put all links in a top layer, so as not to disturb the stereotype groups bounding box,
    // since associations and generalizations can go accross stereotypes and packages
    // const links = this.svg
    //   .append('g')
    //   .attr('class', 'links');
    // links // Render associations
    //   .selectAll('g.association')
    //   .data(this.modelService.getAssociations())
    //   .enter()
    //   .append('g')
    //   .attr('class', 'association')
    //   .each(function (d) { d.boxElement = this; }); // Each association is responsible for its own render
    // links // Render generalizations
    //   .selectAll('g.generalization')
    //   .data(this.modelService.getGeneralizations())
    //   .enter()
    //   .append('g')
    //   .attr('class', 'generalization')
    //   .each(function (d) { d.boxElement = this; }); // Each generalization is responsible for its own render

    // Render stereotypes
    this.model.modelBase.boxElement = this.svg.node();
    setTimeout(() => {
      this.update();
      setTimeout(() => this.update()); // Needs to run update twice in order to set proper layout
      D3.select(this.model.modelBase.boxElement).selectAll('g.element')
        .on('click', (d: Classification) => me.router.navigate(['/docs', d.id], { queryParams: me.modelService.queryParams }));
    });
  }

  update() {
    // Update every part of the model
    this.model.modelBase.update();
    // this.modelService.getTopPackages().forEach(type => {
    //   this.modelService.getClasses(type).forEach(cls => cls.update());
    //   type.update();
    //   setTimeout(() => this.modelService.getAssociations(type).forEach(ass => ass.update()));
    //   setTimeout(() => this.modelService.getGeneralizations(type).forEach(general => {
    //     general.update();
    //   }));
    // });

    setTimeout(() => {
      const height = (<SVGGElement>document.querySelector('svg.diagram > g.model')).getBBox().height;
      const svg = <SVGElement>document.querySelector('svg.diagram');
      svg.setAttribute('style', 'height: ' + (height + 10) + 'px');
    });
  }
}
