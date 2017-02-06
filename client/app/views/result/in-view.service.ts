import { Injectable } from '@angular/core';

@Injectable()
export class InViewService {

  constructor() { }

  private getWindowSize() {
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

  public isElmInView(elm) {
    if (elm) {
      const box = elm.getBoundingClientRect();
      if (box.top < (this.getWindowSize().h - 60) && box.bottom > 60) {
        return true;
      }
    }
    return false;
  }
}
