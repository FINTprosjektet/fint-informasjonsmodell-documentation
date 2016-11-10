import { Component, ElementRef, Input, OnInit, Renderer } from '@angular/core';
import { Package } from '../../../../EA/model/Package';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss']
})
export class PackageComponent implements OnInit {
  @Input() package: Package;
  @Input() header: boolean = true;

  constructor(private elm: ElementRef, private renderer: Renderer) { }

  ngOnInit() {
    this.renderer.setElementAttribute(this.elm.nativeElement, 'id', this.package.xmlId);
  }

}
