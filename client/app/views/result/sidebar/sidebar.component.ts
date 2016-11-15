import { Component, Input, OnInit } from '@angular/core';
import { Stereotype } from '../../../EA/model/Stereotype';
import { each } from 'lodash';

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
  getWindowSize() {
    let winW = 0; let winH = 0;
    if (document.body && document.body.offsetWidth) {
      winW = document.body.offsetWidth;
      winH = document.body.offsetHeight;
    }
    if (document.compatMode === 'CSS1Compat' &&
      document.documentElement &&
      document.documentElement.offsetWidth) {
      winW = document.documentElement.offsetWidth;
      winH = document.documentElement.offsetHeight;
    }
    if (window.innerWidth && window.innerHeight) {
      winW = window.innerWidth;
      winH = window.innerHeight;
    }
    return { w: winW, h: winH };
  }
  checkElementInView() {
    each(this.stereotypes, type => {
      let elm = document.getElementById(type.xmlId);
      if (elm) {
        elm = elm.parentElement.parentElement;
        let box = elm.getBoundingClientRect();
        if (box.top < (this.getWindowSize().h - 60) && box.bottom > 60) {
          type.isActive = true;
          return;
        }
      }
      type.isActive = false;
    });
  }
}
