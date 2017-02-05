import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { MarkdownToHtmlPipe } from 'markdown-to-html-pipe';

import { Classification } from '../../../../EA/model/Classification';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit, OnDestroy {
  @Input() classification: Classification;
  searchSubscription: Subscription;
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

  constructor(private elm: ElementRef, private renderer: Renderer, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: any) => this.isSelected = params.id === this.classification.id);
    this.searchSubscription = this.route.queryParams.subscribe((params: any) => {
      this.searchStr = params.s;
    });
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }
}
