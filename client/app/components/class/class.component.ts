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
  @Input() associations: Association[];

  constructor(private elm: ElementRef, private renderer: Renderer) { }

  ngOnInit() {
    this.renderer.setElementAttribute(this.elm.nativeElement, 'id', this.classification.id);
  }

}
