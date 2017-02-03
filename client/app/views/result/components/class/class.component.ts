import { ActivatedRoute } from '@angular/router';
import { Classification } from '../../../../EA/model/Classification';
import { Component, ElementRef, Input, OnInit, Renderer } from '@angular/core';
import { MarkdownToHtmlPipe } from 'markdown-to-html-pipe';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  @Input() classification: Classification;

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
    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.renderer.setElementClass(this.elm.nativeElement, 'selected', params.id === this.classification.id);
        setTimeout(() => {
          this.renderer.setElementClass(this.elm.nativeElement, 'selected', false);
        }, 2000);
      }
    });
  }
}
