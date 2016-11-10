import { Stereotype } from '../../EA/model/Stereotype';
import { Model } from '../../EA/model/Model';
import { Title } from '@angular/platform-browser';
import { ModelService } from '../../EA/model.service';
import { Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as D3 from 'd3';

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
      .attr('x', (d, index, arr) => 1) //(index * 200) + me.margin.right)
      .attr('y', (d, index, arr) => (index * 103) + me.margin.bottom)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('width', 200)
      .attr('height', 100)
      .on('click', (d: Stereotype) => me.router.navigate(['/api'], { fragment: d.xmlId }));
    stereotype // Add a header
      .append('text')
      .text((d: Stereotype) => d.name)
      .attr('x', (d, index, arr) => 10) //(index * 200) + me.margin.right)
      .attr('y', (d, index, arr) => (index * 103) + 20 + me.margin.top);

    // Render classes
    let allClasses = stereotype.selectAll('g.class')
      .data((d: Stereotype) => d.class)
      .enter();
    let classStruct = allClasses.append('g')
      .attr('class', 'class');
    classStruct
      .append('rect')
      .attr('x', (d, index, arr) => (index * 20)) //(index * 200) + me.margin.right)
      .attr('y', (d, index, arr) => 40)
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('width', 10)
      .attr('height', 10);

  }

  private getClasses(stereotypes: Stereotype[]) {
    return stereotypes;
  }
}
