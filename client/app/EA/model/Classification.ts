import { Generailzation } from './Generalization';
import { document } from '@angular/platform-browser/src/facade/browser';
import { Association } from './Association';
import { Stereotype } from './Stereotype';
import { EABaseClass } from './EABaseClass';
import { Attribute } from './Attribute';
import * as D3 from '../../d3.bundle';
import { each } from 'lodash';

export class Classification extends EABaseClass {
  attributes: Attribute[];
  type: string = 'table';
  associations: Association[];

  _inheritsFrom: Generailzation[];
  get inheritsFrom(): Generailzation[] {
    if (!this._inheritsFrom) {
      this._inheritsFrom = EABaseClass.service.getAllGeneralizations().filter(general => general._subType === this.xmlId);
    }
    return this._inheritsFrom;
  }

  _isParentTo: Generailzation[];
  get isParentTo(): Generailzation[] {
    if (!this._isParentTo) {
      this._isParentTo = EABaseClass.service.getAllGeneralizations().filter(general => general._superType === this.xmlId);
    }
    return this._isParentTo;
  }

  // Properties for rendering
  private _boxElement: SVGGElement;
  get boxElement() { return this._boxElement; }
  set boxElement(elm: SVGGElement) {
    this._boxElement = elm;
    this.render();
  }
  x: number;
  y: number;
  width: number;
  height: number = 30;

  constructor(json, parent: EABaseClass) {
    super(json, parent);

    if (parent instanceof Stereotype && (<Stereotype>parent).associations) {
      this.associations = (<Stereotype>parent).associations.filter(assoc => assoc.meta['ea_sourceID'] === this.id);
    }

    if (json['Classifier.feature'] && json['Classifier.feature'].Attribute) {
      if (Array.isArray(json['Classifier.feature'].Attribute)) {
        this.attributes = json['Classifier.feature'].Attribute.map(attr => new Attribute(attr, this));
      } else {
        this.attributes = [new Attribute(json['Classifier.feature'].Attribute, this)];
      }
    }

    if (json['ModelElement.stereotype']) {
      this.type = json['ModelElement.stereotype'].Stereotype['_name'];
    }
  }

  filter(search: string) {
    let matchAttributes = [];
    let matchAssociations = [];
    let matchType = this.type.toLowerCase().indexOf(search.toLowerCase()) > -1;
    let matchName = this.name.toLowerCase().indexOf(search.toLowerCase()) > -1;

    if (this.associations) {
      matchAssociations = this.associations.filter(assoc => assoc.meta['rt'].toLowerCase().indexOf(search.toLowerCase()) > -1);
    }
    if (this.attributes) {
      matchAttributes = this.attributes.filter(attr => attr.name.toLowerCase().indexOf(search.toLowerCase()) > -1);
    }
    if (matchType || matchAttributes.length || matchAssociations.length || matchName) {
      return this;
    }
    return null;
  }

  getAbsolutePosition(): { x: number, y: number } {
    let bbox = this.boxElement.getBBox();
    let middleX = bbox.x + (bbox.width / 2);
    let middleY = bbox.y + (bbox.height / 2);

    let convert = this.makeAbsoluteContext(this.boxElement);
    return convert(middleX, middleY);
  }

  addClass(elm: SVGGElement, className: string) {
    if (elm) {
      if (elm.classList) { elm.classList.add(className); }
      else if (!(new RegExp('(\\s|^)' + className + '(\\s|$)').test(elm.getAttribute('class')))) {
        elm.setAttribute('class', elm.getAttribute('class') + ' ' + className);
      }
    }
  }

  removeClass(elm: SVGGElement, className: string) {
    if (elm) {
      if (elm.classList) { elm.classList.remove(className); }
      else {
        var removedClass = elm.getAttribute('class').replace(new RegExp('(\\s|^)' + className + '(\\s|$)', 'g'), '$2');
        if (new RegExp('(\\s|^)' + className + '(\\s|$)').test(elm.getAttribute('class'))) {
          elm.setAttribute('class', removedClass);
        }
      }
    }
  }

  render() {
    let me = this;
    // Add class and id attributes to box element
    D3.select(this.boxElement)
      .attr('class', 'class ' + this.type.toLowerCase())
      .attr('id', this.xmlId)
      .on('mouseover', function () {
        each(document.querySelectorAll('.source_' + me.xmlId), elm => {
          me.addClass(elm, 'over'); me.addClass(elm, 'source');
        });
        each(document.querySelectorAll('.target_' + me.xmlId), elm => {
          me.addClass(elm, 'over'); me.addClass(elm, 'target');
        });
      })
      .on('mouseout', function () {
        each(document.querySelectorAll('.source_' + me.xmlId + ', .target_' + me.xmlId), elm => {
          me.removeClass(elm, 'over'); me.removeClass(elm, 'source'); me.removeClass(elm, 'target');
        });
      });

    // Calculate width of box based on text width
    D3.select(this.boxElement)
      .append('text')
      .text(this.name)
      .each(function (d: Classification) {
        me.width = this.getBBox().width + 20;
        if (this.remove) {
          this.remove();
        } else {
          this.parentNode.removeChild(this); // Supporting IE
        }
      });

    // Add a rect
    D3.select(this.boxElement)
      .append('rect')
      .attrs({ x: 0, y: 0, rx: 5, ry: 5, width: this.width, height: this.height });

    // Add a header
    D3.select(this.boxElement)
      .append('text')
      .text(this.name)
      .attrs({ x: 10, y: 20 });
  }

  getStereotype(): Stereotype {
    return this.boxElement.parentNode.parentNode['__data__'];
  }

  getPrevious(): Classification {
    let previous = this.boxElement.previousSibling;
    if (previous) {
      if (previous['__data__'] && previous['__data__'] instanceof Classification) {
        return previous['__data__'];
      }
    }
    return null;
  }

  update() {
    let idx = Array.prototype.indexOf.call(this.boxElement.parentNode.childNodes, this.boxElement);
    let parent: Stereotype = this.getStereotype();
    let previous: Classification = this.getPrevious();

    this.x = (previous ? (previous.x + previous.width) : 0) + 10;
    this.y = (previous ? previous.y : 20);
    if (previous && (this.x + this.width) > parent.width) {
      // Fall down one line
      this.y = previous.y + 35;
      this.x = 10;
    }

    D3.select(this.boxElement)
      .attr('transform', `translate(${this.x}, ${this.y})`);
  }
}
