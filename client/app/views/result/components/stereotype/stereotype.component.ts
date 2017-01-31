import { Stereotype } from '../../../../EA/model/Stereotype';
import { Component, Input, OnInit, ElementRef, Renderer } from '@angular/core';

@Component({
  selector: 'app-stereotype',
  templateUrl: './stereotype.component.html',
  styleUrls: ['./stereotype.component.scss']
})
export class StereotypeComponent implements OnInit {
  @Input() stereotype: any;
  constructor(private elm: ElementRef, private renderer: Renderer) { }

  ngOnInit() {
    if (this.stereotype.packagedElement) {
      this.renderer.setElementClass(this.elm.nativeElement, 'package-container', true);
    }
  }
}
