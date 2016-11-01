import { Classification } from '../../EA/model/Classification';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  @Input() classification: Classification;
  constructor() { }

  ngOnInit() {
  }

}
