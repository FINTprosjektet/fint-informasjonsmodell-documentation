import { Stereotype } from '../../EA/model/Stereotype';
import { Component, Input, OnInit, ElementRef, Renderer } from '@angular/core';

@Component({
  selector: 'app-stereotype',
  templateUrl: './stereotype.component.html',
  styleUrls: ['./stereotype.component.scss']
})
export class StereotypeComponent implements OnInit {
  @Input() stereotype: Stereotype;
  constructor(private elm: ElementRef, private renderer: Renderer) { }

  ngOnInit() {
    if (this.stereotype.packages) {
      this.renderer.setElementClass(this.elm.nativeElement, 'package-container', true);
      this.renderer.setElementAttribute(this.elm.nativeElement, 'id', this.stereotype.xmlId);
    }
  }
}
