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

  get classType() {
    switch (this.classification.type.toLowerCase()) {
      case 'class': return 'table';
      case 'codelist': return 'list-alt';
      case 'datatype': return 'id-card-o';
      case 'enumeration': return 'bars';
      case 'abstract': return 'puzzle-piece';
      default: return '';
    }
  }

  get associations() {
    let assoc: Association[] = [];
    if (this.classification && this.classification.referredBy) {
      assoc = [].concat(this.classification.referredBy.filter(r => r instanceof Association && r.start));
    }
    return assoc;
  }

  get cssClass() {
    const cls = [];
    if (this.classification.isBaseClass) { cls.push('mainclass'); }
    else {
      cls.push(this.classification.type.toLowerCase())
    }
    if (this.isSelected) { cls.push('selected'); }
    return cls.join(' ');
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
    attr.isOpen = !attr.isOpen;
    if (attr.isOpen) {
      setTimeout(() => this.router.navigate(['/docs', this.classification.id, attr.id], { queryParams: this.classification.queryParams }));
    } else {
      setTimeout(() => this.router.navigate(['/docs', this.classification.id], { queryParams: this.classification.queryParams }));
    }
  }
}
