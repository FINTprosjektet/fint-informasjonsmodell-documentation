import { Component, Input } from '@angular/core';
import * as each from 'lodash/each';

import { Stereotype } from '../../../EA/model/Stereotype';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() stereotypes: any[] = null;
  constructor() { }

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
    const me = this;
    this.stereotypes.forEach(type => {
      type.isActive = me.isElmInView(document.getElementById(type.id));
      type.classes.forEach(cls => cls.isActive = me.isElmInView(document.getElementById(cls.id)));
    });
  }

  isElmInView(elm) {
    if (elm) {
      const box = elm.getBoundingClientRect();
      if (box.top < (this.getWindowSize().h - 60) && box.bottom > 60) {
        return true;
      }
    }
    return false;
  }
}
