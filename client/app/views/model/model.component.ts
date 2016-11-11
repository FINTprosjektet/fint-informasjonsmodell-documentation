import { Package } from '../../EA/model/Package';
import { Classification } from '../../EA/model/Classification';
import { Stereotype } from '../../EA/model/Stereotype';
import { Model } from '../../EA/model/Model';
import { Title } from '@angular/platform-browser';
import { ModelService } from '../../EA/model.service';
import { Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as D3 from '../../d3.bundle';

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
  private margin;
  private htmlElement: HTMLElement;

  constructor(private modelService: ModelService, private router: Router, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('FINT | information model');
  }

  ngAfterViewInit() {
    let me = this;
    this.htmlElement = this.element.nativeElement;
    this.host = D3.select(this.htmlElement);

    // Load data and render
    this.modelService.fetchModel().then(function (model: Model) {
      me.model = model;
      me.setup();
      me.buildModel();
    });
  }

  private setup(): void {
    this.margin = { top: 10, right: 10, bottom: 10, left: 10 };
    this.width = this.htmlElement.clientWidth - this.margin.left - this.margin.right;
    this.height = (this.model.package.stereotypes.length * 100) + this.margin.top + this.margin.bottom;

    this.host.html('');
    this.svg = this.host.append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('class', 'model')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private buildModel() {
    let me = this;

    // Render stereotypes
    let allStereotypes = this.svg.selectAll('g.stereotype')
      .data(this.getClasses(this.model.package.stereotypes))
      .enter();
    let stereotype = allStereotypes.append('g')
      .attr('class', 'stereotype');
    stereotype // Build a rectangle to hold the stereotype
      .append('rect')
      .each(function (d: Stereotype, index: number) { D3.select(this).attrs(d.renderBox(index, this.margin)); })
      .on('click', (d: Stereotype) => me.router.navigate(['/api'], { fragment: d.xmlId }));
    stereotype // Add a header
      .append('text')
      .text((d: Stereotype) => d.name)
      .each(function (d: Stereotype, index: number) { D3.select(this).attrs(d.renderText(index, this.margin)); });

    // Render classes
    let allClasses = stereotype.selectAll('g.class')
      .data(d => d.allClasses)
      .enter();
    let classStruct = allClasses.append('g')
      .attr('class', (d: Classification) => 'class ' + d.type.toLowerCase());
    classStruct // Calculate width of box based on text width
      .append('text')
      .text((d: Classification) => d.name)
      .each(function (d: Classification, index: number) { d.width = this.getBBox().width + 20; this.remove(); });
    classStruct // Build a rectangle to hold the class
      .append('rect')
      .each(function (d: Classification, index: number) { D3.select(this).attrs(d.renderBox(index, this.margin)); })
      .on('click', (d: Classification) => me.router.navigate(['/api'], { fragment: d.xmlId }));
    classStruct // Apply the text
      .append('text')
      .text((d: Classification) => d.name)
      .each(function (d: Classification, index: number) { D3.select(this).attrs(d.renderText(index, this.margin)); })
      .on('click', (d: Classification) => me.router.navigate(['/api'], { fragment: d.xmlId }));
  }

  private getClasses(stereotypes: Stereotype[]) {
    return stereotypes;
  }
}
