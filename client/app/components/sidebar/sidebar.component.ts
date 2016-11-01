import { Stereotype } from '../../EA/model/Stereotype';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() stereotypes: Stereotype[] = null;
  constructor() { }

  ngOnInit() {
  }

}
