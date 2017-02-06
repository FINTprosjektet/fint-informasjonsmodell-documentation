import { InViewService } from '../in-view.service';
import { Observable } from 'rxjs/Rx';
import { AfterViewInit, Component, Input } from '@angular/core';
import * as each from 'lodash/each';

import { Stereotype } from 'app/EA/model/Stereotype';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit {
  @Input() stereotypes: any[] = null;
  constructor(private InView: InViewService) { }

  ngAfterViewInit() {
    Observable.fromEvent(window, 'scroll')
      .throttleTime(500)
      .subscribe(e => {
        this.checkElementInView();
      });
  }

  checkElementInView() {
    const me = this;
    this.stereotypes.forEach(type => {
      type.isActive = me.InView.isElmInView(document.getElementById(type.id));
      type.classes.forEach(cls => cls.isActive = me.InView.isElmInView(document.getElementById(cls.id)));
    });
  }
}
