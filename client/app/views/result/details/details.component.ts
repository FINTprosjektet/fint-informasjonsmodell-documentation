import { Component } from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
  isOpen: boolean = false;

  constructor() { }

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}
