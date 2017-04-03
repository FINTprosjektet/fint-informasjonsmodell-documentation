import { Injectable } from '@angular/core';

@Injectable()
export class ModelStateService {

  private _isSticky = false;
  get isSticky() { return this._isSticky; }
  set isSticky(value) {
    this._isSticky = value;
  }

  legendVisible: boolean = true;

  constructor() { }

}
