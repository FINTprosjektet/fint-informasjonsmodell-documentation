import { AfterViewInit, Component, ElementRef, HostListener, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import * as D3 from 'app/d3.bundle';
import { forceRectCollide } from './util/ForceRectCollide';
import { forceBoundedBox } from './util/BoundedBox';
// import forceGravityGroup from './util/ForceGravityGroup';

import { ModelService } from 'app/EA/model.service';
import { IModelContainer, Model } from 'app/EA/model/Model';
import { EALinkBase } from 'app/EA/model/EALinkBase';
import { EANode } from 'app/EA/model/EANode';
// import { Stereotype } from 'app/EA/model/Stereotype';
import { Classification } from 'app/EA/model/Classification';
import { Generalization } from 'app/EA/model/Generalization';
import { Association } from 'app/EA/model/Association';
import { Package } from 'app/EA/model/Package';
import { EANodeContainer } from 'app/EA/model/EANodeContainer';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit, AfterViewInit, OnDestroy {
  // Elements
  @ViewChild('container') element: ElementRef;
  private htmlElement: HTMLElement;
  private host;
  private svg;

  legendVisible: boolean = true;

  // Our datasource
  private model: IModelContainer;

  // Properties we need to destroy when we exit this view
  private versionSubscription: Subscription;
  private simulation: D3.Simulation<EANode, EALinkBase>;

  // Data arrays for D3 rendering
  private links;
  private hull;
  private nodes;

  // Properties used by hull
  private hullOffset = 10;
  private hullCurve = D3.line().curve(D3.curveCatmullRomClosed);

  // Properties used in D3 drag event
  private maxVelocity = 8;
  private px;
  private py;
  private vx;
  private vy;
  private offsetX;
  private offsetY;

  // Properties used for displaying legend
  types = [
    { name: 'Hoved klasse', type: 'mainclass' },
    { name: 'Kompleks datatype', type: 'class' },
    { name: 'Abstrakt', type: 'abstract' },
  ];
  lines = [
    { name: 'Generalization target', type: 'generalization target' },
    { name: 'Generalization source', type: 'generalization source' },
    { name: 'Association target', type: 'association target' },
    { name: 'Association source', type: 'association source' },
  ];
  colors = [];

  private get width() { return this.htmlElement.clientWidth; }
  private get height() { return this.htmlElement.clientHeight; }

  get isLoading() { return this.modelService.isLoading; }
  set isLoading(flag) { this.modelService.isLoading = flag; }

  constructor(private modelService: ModelService, private router: Router, private titleService: Title, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.titleService.setTitle('Model | Fint');
  }

  ngAfterViewInit() {
    this.htmlElement = this.element.nativeElement;
    this.host = D3.select(this.htmlElement);

    // Load data and render
    this.modelService.searchString = '';
    this.versionSubscription = this.modelService.versionChanged.subscribe(v => this.loadData());
    this.loadData(); // Initial load
  }

  ngOnDestroy() {
    this.versionSubscription.unsubscribe();
    this.simulation.stop();
  }

  loadData() {
    const me = this;
    this.isLoading = true;
    if (this.simulation) { this.simulation.stop(); }
    this.modelService.fetchModel().subscribe(model => {
      // Reset
      me.colors = [];
      me.links = null;
      me.hull = null;
      me.nodes = null;

      me.model = model;
      me.render();
      me.isLoading = false;
    });
  }

  private render() {
    const me = this;

    // Create container element
    this.host.html('');
    this.svg = this.host.append('svg')
      .attr('class', 'diagram model')
      .attr('transform', 'translate(0,0)');

    // Define Arrow markers
    const defs = this.svg.append('defs');
    defs
      .selectAll('marker')
      .data(['neutral', 'source', 'target'])
      .enter()
      .append('marker')
      .attrs({
        'id': m => 'arrow_' + m,
        'class': m => m,
        'refX': 6,
        'refY': 6,
        'markerWidth': 30,
        'markerHeight': 30,
        'orient': 'auto'
      })
      .append('path')
      .attr('d', 'M 0 0 12 6 0 12 3 6')
      .attr('class', 'arrowHead');

    // Define reusable drop shadow filter
    const filter = defs.append('filter').attrs({'id': 'dropshadow'});
    filter.append('feGaussianBlur').attrs({'in': 'SourceAlpha', 'stdDeviation': 2, 'result': 'offOut'});
    filter.append('feOffset').attrs({'in': 'offOut', 'dx': 0, 'dy': 2, 'result': 'blurOut'});
    filter.append('feBlend').attrs({'in': 'SourceGraphic', 'in2': 'blurOut', 'mode': 'normal'});

    // Extract data to present
    const allLinks = this.modelService.getLinkNodes();
    const nodeElements = this.modelService.getNodes(this.model.modelBase);
    const packageLinks = nodeElements.map(c => { return { source: c, target: c.parentPackage }; }).filter(c => typeof c.target !== 'undefined');

    // Render data
    this.hull = this.renderHulls(nodeElements);
    this.links = this.renderLinks(allLinks);
    this.nodes = this.renderClasses(nodeElements);

    // Setup force directed simulation
    this.simulation = D3.forceSimulation<EANode>(nodeElements)
      // Apply link force
      .force('link', D3.forceLink(allLinks).id((l: EALinkBase) => l.xmiId).strength(0.3)
        .distance((l: EALinkBase) => { // larger distance for bigger groups:
          const n1: EANode = l.source, n2: EANode = l.target;
          return n1.parentPackage === n2.parentPackage ? 10 : 100;
        }))

      // Group nodes/packages in same parent package together.
      // This is done by creating an invisible link between the node and the parent package
      .force('group', D3.forceLink(packageLinks).strength(1).distance((l) => {
        if (l.source instanceof Classification && l.target instanceof Package) { return 0; }
        if (l.source instanceof Package && l.target instanceof Package) { return 30; }
        return 100;
      }))

      // Apply node repellant, keeping each node at a distance
      .force('charge', D3.forceManyBody<EANode>()
        .strength((c: EANode) => -600))

      // Apply collision detection, avoiding node overlap
      .force('collision', forceRectCollide<EANode>()
        .size(d => [d.width + 10, d.height + 10]))

      // Apply center of gravity
      .force('center', D3.forceCenter(this.width / 2, this.height / 2))

      // Apply boundaries, avoid nodes being rendered off-canvas
      .force('box', forceBoundedBox<EANode>()
        .size(d => [d.width, d.height])
        .bounds({ x0: 0, y0: this.hullOffset * 2, x1: d => this.width, y1: d => this.height - (this.hullOffset * 2) }))

      // Lastly, apply custom force logic for each tick.
      .on('tick', () => this.update());
  }

  convexHulls(nodes: EANode[]) {
    const hulls = {};
    const fill = D3.scaleOrdinal(D3.schemeCategory20c);

    // create point sets
    for (let k=0; k<nodes.length; ++k) {
      let n = nodes[k];

      let width = n.width, height = n.height;
      if (!n.parentPackage || n.parentPackage.classes.length == 0) {
        // Skip if this node has no group, or if it is a package with no direct classes related to it
        continue;
      }

      let i = n.parentPackage.name;
      let l = hulls[i] || (hulls[i] = []);

      // Add to legend
      if (this.colors.findIndex(c => c.name === i) < 0) {
        this.colors.push({name: i, fill: this.sanitizer.bypassSecurityTrustStyle('background: ' + fill(i)) })
      }

      // Create hull data
      l.push([n.x - this.hullOffset, n.y - this.hullOffset]);
      l.push([n.x - this.hullOffset, n.y + height + this.hullOffset]);
      l.push([n.x + width + this.hullOffset, n.y - this.hullOffset]);
      l.push([n.x + width + this.hullOffset, n.y + height + this.hullOffset]);
      concatParent(n.parentPackage, l);
    }

    function concatParent(n, h) {
      let p = n.parentPackage;
      if (p && hulls[p.name]) {
        hulls[p.name] = hulls[p.name].concat(h);
        concatParent(p, hulls[p.name]);
      }
    }

    // create convex hulls
    const hullset = [];
    for (let h in hulls) {
      hullset.push({group: h, path: D3.polygonHull(hulls[h])});
    }

    return hullset;
  }

  /**
   * Groups nodes in packages using D3 convexHulls
   *
   * @param nodes A collection of `EANode` nodes to group
   */
  private renderHulls(nodes: EANode[]) {
    const hullData = this.convexHulls(nodes);
    const hullGroup = this.svg.append('g').attr('class', 'hull');
    const fill = D3.scaleOrdinal(D3.schemeCategory20c);

    const hull = hullGroup.selectAll('path.hull')
      .data(hullData)
      .enter().append('path')
        .attr('class', d => 'hull ' + d.group.toLowerCase().replace(new RegExp(' ', 'g'), '_'))
        .attr('d', d => this.hullCurve(d.path))
        .style('fill', d => fill(d.group))
        .on('mouseover', d => {
          this.addClass(document.querySelector(`.legend .colors .box.${d.group.toLowerCase().replace(new RegExp(' ', 'g'), '_')}`), 'spotlight');
        })
        .on('mouseleave', d => {
          [].forEach.call(document.querySelectorAll('.legend .colors .box'), elm => this.removeClass(elm, 'spotlight'));
        });

      hull.append('title').text(d => d.group);
      return hull;
  }

  /**
   * Renders every link. A link is either a generalization or an assosiation.
   *
   * @param allLinks A collection of `EALinkBase` linknodes to render
   */
  private renderLinks(allLinks: EALinkBase[]) {
    const linkGroup = this.svg.append('g').attr('class', 'links');
    return linkGroup
      .selectAll('g.links')
      .data(allLinks)
      .enter()
        .append('line')
          .attr('class', (l: EALinkBase) => {
            if (l instanceof Generalization) {
              return `generalization source_${l.source.xmiId} target_${l.target.xmiId}`;
            }
            if (l instanceof Association) {
              return `association source_${l.source.xmiId} target_${l.target.xmiId}`;
            }
          })
          .attr('marker-end', 'url(#arrow_neutral)');
  }

  /**
   * Renders every class
   *
   * @param classes A Collection of `EANode` nodes to render
   */
  private renderClasses(classes: EANode[]) {
    const nodeGroup = this.svg.append('g').attr('class', 'nodes');
    const nodes = nodeGroup
      .selectAll('g.element')
      .data(classes)
      .enter()
      .append('g')
      .attr('class', (c: EANode) => {
        if (c instanceof Classification) {
          return ['element', c.type.toLowerCase()].concat(c.isBaseClass ? ['mainclass'] : []).join(' ');
        }
      })
      .attr('id', (c: EANode) => c.xmiId);

    // Add a mouseover tooltip
    nodes.append('title').text((c: EANode) => (c instanceof Classification ? c.documentationHeader : ''));

    // Add a rectangle
    nodes.append('rect').attrs({
      x: 0, y: 0, rx: 5, ry: 5,
      width: (c: EANode) => { // Calculate the width of the rectangle based on the length of text it should display
        // Create a temp element using the text
        const el = <SVGGElement> D3.select('svg.model.diagram').append('text').text(c.name).node();
        c.width = el.getBBox().width + 30;                        // Gets the calculated text size
        el.remove ? el.remove() : el.parentNode.removeChild(el);  // Remove temp element, supporting IE
        return c.width;                                           // Return the calculated width
      },
      height: (c: EANode) => c.height
    }).style('filter', c => c.isBaseClass ? 'url(#dropshadow)' : '');

    // Add the text
    nodes.append('text').text((c: EANode) => c instanceof Classification ? c.name : ''/*`P:${c.name}`*/).attrs({ x: 10, y: 20 });

    // Apply event handling
    // Drag handling
    nodes.call(D3.drag()
      .on('start', d => this.dragStarted(d))
      .on('drag', d => this.dragged(d))
      .on('end', d => this.dragEnded(d)));
    // MouseOver
    nodes.on('mouseover', (c: EANode) => {
      if (c instanceof Classification) {
        [].forEach.call(document.querySelectorAll('.source_' + c.xmiId), elm => {
          this.addClasses(elm, ['over', 'source']);
          D3.select(elm).attr('marker-end', 'url(#arrow_source)');
        });
        [].forEach.call(document.querySelectorAll('.target_' + c.xmiId), elm => {
          this.addClasses(elm, ['over', 'target']);
          D3.select(elm).attr('marker-end', 'url(#arrow_target)');
        });
        const p = c.parentPackage.name.toLowerCase().replace(new RegExp(' ', 'g'), '_');
        this.addClass(document.querySelector(`.legend .colors .box.${p}`), 'spotlight');
        this.findHull(p);
      }
    });
    // MouseOut
    nodes.on('mouseout', (c: EANode) => {
      if (c instanceof Classification) {
        [].forEach.call(document.querySelectorAll('.source_' + c.xmiId + ', .target_' + c.xmiId), elm => {
          this.removeClasses(elm, ['over', 'source', 'target']);
          D3.select(elm).attr('marker-end', 'url(#arrow_neutral)');
        });
        [].forEach.call(document.querySelectorAll('.legend .colors .box'), elm => this.removeClass(elm, 'spotlight'));
        this.clearHull();
      }
    });
    // Click event
    nodes.on('click', (c: EANode) => {
      if (D3.event.defaultPrevented) return;
      return c instanceof Classification ? this.router.navigate(['/docs', c.id], { queryParams: this.modelService.queryParams }) : null;
    });

    return nodes;
  }

  /**
   * Called each simulation tick
   */
  update() {
    this.nodes.attr('transform', (c: EANode) => `translate(${c.x}, ${c.y})`);
    if (!this.hull.empty()) {
      const classes = this.modelService.getNodes(this.model.modelBase);
      this.hull.data(this.convexHulls(classes)).attr('d', d => this.hullCurve(d.path));
    }
    this.links
      .attr('x1', (l: EALinkBase) => this.calc(l)['x1']) // d.source.x)
      .attr('y1', (l: EALinkBase) => this.calc(l)['y1']) // d.source.y)
      .attr('x2', (l: EALinkBase) => this.calc(l)['x2']) // d.target.x)
      .attr('y2', (l: EALinkBase) => this.calc(l)['y2']) // d.target.y);
  }

  calc(l: EALinkBase) {
    var source = this.createMatrix(l.source);
    var target = this.createMatrix(l.target);
    return {
      x1: source.xCenter, y1: source.yCenter,
      x2: target.xCenter, y2: target.yCenter
    }
  }

  createMatrix(c: EANode) {
    return {
      xLeft: c.x,
      xCenter: (c.width / 2) + c.x,
      xRight: c.x + c.width,

      yLeft: c.y,
      yCenter: (c.height / 2) + c.y,
      yRight: c.y + c.height,
    }
  }

  // EVENT HANDLERS ----------------------------
  /**
   * Called each time the window is resized. This will kickstart the simulation again.
   */
  @HostListener('window:resize', [])
  forceTick() {
    if (this.simulation) {
      this.simulation.alpha(0.5).restart();
    }
  }

  findHull(name) {
    this.addClass(document.querySelector(`svg path.hull.${name.toLowerCase().replace(new RegExp(' ', 'g'), '_')}`), 'spotlight');
  }

  clearHull() {
    [].forEach.call(document.querySelectorAll('svg path.hull'), elm => this.removeClass(elm, 'spotlight'));
  }

  dragStarted(d) {
    D3.event.sourceEvent.stopPropagation();
    this.vx = 0
    this.vy = 0
    this.offsetX = (this.px = D3.event.x) - (d.fx = d.x)
    this.offsetY = (this.py = D3.event.y) - (d.fy = d.y)
  }

  dragged(d) {
    this.simulation.restart();
    this.vx = D3.event.x - this.px
    this.vy = D3.event.y - this.py
    d.fx = Math.max(Math.min((this.px = D3.event.x) - this.offsetX, this.width - d.width), 0)
    d.fy = Math.max(Math.min((this.py = D3.event.y) - this.offsetY, this.height - d.height), 0)
  }

  dragEnded(d) {
    this.simulation.alpha(0.2).restart();
    var vScalingFactor = this.maxVelocity / Math.max(Math.sqrt(this.vx * this.vx + this.vy * this.vy), this.maxVelocity)
    d.fx = null
    d.fy = null
    d.vx = this.vx * vScalingFactor
    d.vy = this.vy * vScalingFactor
  }

    addClass(elm: Element, className: string) {
    if (elm) {
      if (elm.classList) { elm.classList.add(className); }
      else if (!(new RegExp('(\\s|^)' + className + '(\\s|$)').test(elm.getAttribute('class')))) {
        elm.setAttribute('class', elm.getAttribute('class') + ' ' + className);
      }
    }
  }
  addClasses(elm: Element, classNames: string[]) {
    classNames.forEach(n => this.addClass(elm, n));
  }

  removeClass(elm: Element, className: string) {
    if (elm) {
      if (elm.classList) { elm.classList.remove(className); }
      else {
        const removedClass = elm.getAttribute('class').replace(new RegExp('(\\s|^)' + className + '(\\s|$)', 'g'), '$2');
        if (new RegExp('(\\s|^)' + className + '(\\s|$)').test(elm.getAttribute('class'))) {
          elm.setAttribute('class', removedClass);
        }
      }
    }
  }
  removeClasses(elm: Element, classNames: string[]) {
    classNames.forEach(n => this.removeClass(elm, n));
  }
}
