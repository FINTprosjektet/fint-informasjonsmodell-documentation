import { EANodeContainer } from './EANodeContainer';
import { Classification } from './Classification';
import { Package } from './Package';
import { EABaseClass } from './EABaseClass';
import * as D3 from 'app/d3.bundle';

/**
 * Represents a top package
 *
 * @export
 * @class Stereotype
 * @extends {Package}
 */
export class Stereotype extends EANodeContainer {
  static umlId = 'uml:Package';

  get x(): number { return 1; };
  get y(): number {
    const previous: any = this.getPrevious();
    return (previous ? (previous.y + previous.height) : 0) + 10;
  };
  width: number = 0;
  height: number = 0;

  /**
   * Creates an instance of Stereotype.
   *
   * @param {{}} json
   * @param {EABaseClass} parent
   *
   * @memberOf Stereotype
   */
  constructor() {
    super();
  }

  calculatedWidth(): number {
    return this.boxElement.ownerSVGElement.clientWidth - 5;
  }

  render() {
    // Add a rect
    const d3Select = D3.select(this.boxElement);
    d3Select.attrs({ 'class': 'stereotype', 'id': this.xmiId })
      .append('rect').attrs({ x: 0, y: 0, rx: 10, ry: 10, width: '100%', height: 100 });
    const bbox = (<SVGGElement>this.boxElement).getBBox();
    this.width = bbox.width;
    this.height = bbox.height;

    // Add a header
    d3Select.append('text').text(this.name).attrs({ x: 10, y: 15 });

    // Render standalone clases
    d3Select.selectAll('g.element')
      .data((d: Stereotype) => d.classes)
      .enter().append('g').each(function (d: Classification) { d.boxElement = <SVGElement>this; });

    // Render packages
    d3Select.selectAll('g.package')
      .data((d: Stereotype) => d.packages)
      .enter().append('g').each(function (d: Package) { d.boxElement = <SVGElement>this; });
  }

  update() {
    if (this.boxElement) {
      const container = D3.select(this.boxElement);

      // Update children
      this.classes.forEach(c => c.update());
      this.packages.forEach(p => p.update());

      // Calculate width / height
      this.width = this.boxElement.ownerSVGElement.clientWidth - 5;
      this.height = this.calculatedHeight();
      container.select('rect')
        .attrs({ width: this.width, height: this.height });


      // Calculate + render x/y translation
      container.select('rect').attrs({ x: this.x, y: this.y });
      container.select('text').attrs({ x: this.x + 10, y: this.y + 15 });
    }
  }
}
