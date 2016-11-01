import { Component, Input, OnInit } from '@angular/core';
import { Package } from '../../EA/model/Package';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss']
})
export class PackageComponent implements OnInit {
  @Input() package: Package;
  @Input() header: boolean = true;
  constructor() { }

  ngOnInit() {
  }

}
