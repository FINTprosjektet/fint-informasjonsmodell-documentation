import { Association } from '../../EA/model/Association';
import { Classification } from '../../EA/model/Classification';
import { Component, ElementRef, Input, OnInit, Renderer } from '@angular/core';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  @Input() classification: Classification;

  get classType() {
    switch (this.classification.type.toLowerCase()) {
      case 'table': return 'table';
      case 'codelist': return 'list-alt';
      case 'datatype': return 'id-card-o';
      case 'enumeration': return 'bars';
      default: return '';
    }
  }

  constructor(private elm: ElementRef, private renderer: Renderer) { }

  ngOnInit() {
    this.renderer.setElementClass(this.elm.nativeElement, this.classification.type, true);
  }
}
