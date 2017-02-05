import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as D3 from '../../d3.bundle';
import * as each from 'lodash/each';

import { ModelService } from '../../EA/model.service';
import { Model } from '../../EA/model/Model';
import { Stereotype } from '../../EA/model/Stereotype';
import { Classification } from '../../EA/model/Classification';
import { Generalization } from '../../EA/model/Generalization';
import { Association } from '../../EA/model/Association';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit, AfterViewInit {
  @ViewChild('container') element: ElementRef;

  private model: Model;
  private host;
  private svg;
  private width;
  private height;
  private htmlElement: HTMLElement;
  isLoading: boolean = false;

  constructor(private modelService: ModelService, private router: Router, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('FINT | model');
  }

  ngAfterViewInit() {
    const me = this;
    this.htmlElement = this.element.nativeElement;
    this.host = D3.select(this.htmlElement);

    // Load data and render
    this.modelService.searchString = '';
    this.isLoading = true;
    this.modelService.fetchModel().subscribe(model => {
      me.model = model;
      me.setup();
      me.render();
      me.isLoading = false;
    });
  }

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
    const defs = this.svg.append('defs');
    defs.selectAll('marker')
      .data(['neutral', 'source', 'target'])
      .enter()
      .append('marker')
      .attrs({
        'id': d => 'arrow_' + d,
        'class': d => d,
        'refX': 6,
        'refY': 6,
        'markerWidth': 30,
        'markerHeight': 30,
        'orient': 'auto'
      })
      .append('path')
      .attr('d', 'M 0 0 12 6 0 12 3 6')
      .attr('class', 'arrowHead');

    // Put all links in a top layer, so as not to disturb the stereotype groups bounding box,
    // since associations and generalizations can go accross stereotypes
    const links = this.svg
      .append('g')
      .attr('class', 'links');
    links // Render associations
      .selectAll('g.association')
      .data(this.modelService.getAssociations())
      .enter()
      .append('g')
      .attr('class', 'association')
      .each(function (d) { d.boxElement = this; }); // Each association is responsible for its own render
    links // Render generalizations
      .selectAll('g.generalization')
      .data(this.modelService.getGeneralizations())
      .enter()
      .append('g')
      .attr('class', 'generalization')
      .each(function (d) { d.boxElement = this; }); // Each generalization is responsible for its own render

    // Render stereotypes
    const allStereotypes = this.svg
      .append('g')
      .attr('class', 'stereotypes')
      .selectAll('g.stereotype')
      .data(this.modelService.getTopPackages())
      .enter();
    const stereotypeGroup = allStereotypes.append('g')
      .each(function (d) {
        d.boxElement = this;  // Let the stereotype render the element
        D3.select(d.boxElement.querySelector('rect')).on('click', () => me.router.navigate(['/docs', d.id]));
      })
      .append('g');

    // Render classes (inside the stereotype group)
    stereotypeGroup.selectAll('g.element')
      .data(d => this.modelService.getClasses(d))
      .enter()
      .append('g')
      .each(function (d) { d.boxElement = this; }) // Let the Class render the element
      .on('click', d => me.router.navigate(['/docs', d.id]));

    setTimeout(() => this.update());
  }

  update() {
    // Update every part of the model
    each(this.modelService.getTopPackages(), type => {
      each(this.modelService.getClasses(type), cls => cls.update());
      type.update();
      setTimeout(() => each(this.modelService.getAssociations(type), ass => ass.update()));
      setTimeout(() => each(this.modelService.getGeneralizations(type), general => {
        general.update();
      }));
    });
    setTimeout(() => {
      const height = (<SVGGElement>document.querySelector('svg.diagram > g.model')).getBBox().height;
      const svg = <SVGElement>document.querySelector('svg.diagram');
      svg.setAttribute('style', 'height: ' + (height + 10) + 'px');
    });
  }
}
