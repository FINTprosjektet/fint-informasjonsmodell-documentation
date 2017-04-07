import { EABaseClass } from '../../../../EA/model/EABaseClass';
import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Classification } from 'app/EA/model/Classification';
import { Association } from "app/EA/model/Association";

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit, OnDestroy {
  @Input() classification: Classification;
  searchSubscription: Subscription;
  routeParamSubscription: Subscription;
  isSelected: boolean = false;
  searchStr: string;

  _classType;
  get classType() {
    if (!this._classType) {
      switch (this.classification.type.toLowerCase()) {
        case 'mainclass':   this._classType = 'table'; break;
        case 'class':       this._classType = 'table'; break;
        case 'codelist':    this._classType = 'list-alt'; break;
        case 'datatype':    this._classType = 'id-card-o'; break;
        case 'enumeration': this._classType = 'bars'; break;
        case 'abstract':    this._classType = 'puzzle-piece'; break;
        default:            this._classType = '';
      }
    }
    return this._classType;
  }

  _cssClass;
  get cssClass() {
    if (!this._cssClass) {
      const cls = [];
      cls.push(this.classification.type.toLowerCase())
      if (this.isSelected) { cls.push('selected'); }
      this._cssClass = cls.join(' ');
    }
    return this._cssClass;
  }

  _assoc;
  get associations() {
    if (!this._assoc) {
      this._assoc = this.classification.associations.map(r => r.getAssociationEnd(this.classification));
    }
    return this._assoc;
  }

  _attribs;
  get attributes() {
    if (!this._attribs) {
      this._attribs = this.classification.ownedAttribute;
      let c = this.classification;
      while (c.superType) {
        if (!this._attribs) { this._attribs = []; }
        this._attribs = this._attribs.concat(c.superType.ownedAttribute);
        c = c.superType;
      }
    }
    return this._attribs;
  }

  constructor(private elm: ElementRef, private renderer: Renderer, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.routeParamSubscription = this.route.params.subscribe((params: any) => this.isSelected = params.id === this.classification.id);
    this.searchSubscription = this.route.queryParams.subscribe((params: any) => {
      this.searchStr = params.s;
    });
  }

  ngOnDestroy() {
    // if (this.searchSubscription) { this.searchSubscription.unsubscribe(); }
    if (this.routeParamSubscription) { this.routeParamSubscription.unsubscribe(); }
  }

  openAttribute(attr) {
    this.classification.associations.forEach(a => a.isOpen = false);
    attr.isOpen = !attr.isOpen;
    if (attr.isOpen) {
      setTimeout(() => this.router.navigate(['/docs', this.classification.id, attr.id], { queryParams: this.classification.queryParams }));
    } else {
      setTimeout(() => this.router.navigate(['/docs', this.classification.id], { queryParams: this.classification.queryParams }));
    }
  }

  openAssociation(assoc) {
    const flag = !assoc.isOpen;
    this.classification.associations.forEach(a => a.isOpen = false);
    assoc.isOpen = flag;
    // if (assoc.isOpen) {
    //   setTimeout(() => this.router.navigate(['/docs', this.classification.id, assoc.id], { queryParams: this.classification.queryParams }));
    // } else {
    //   setTimeout(() => this.router.navigate(['/docs', this.classification.id], { queryParams: this.classification.queryParams }));
    // }
  }
}
