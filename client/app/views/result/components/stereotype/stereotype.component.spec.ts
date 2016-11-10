/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StereotypeComponent } from './stereotype.component';

describe('StereotypeComponent', () => {
  let component: StereotypeComponent;
  let fixture: ComponentFixture<StereotypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StereotypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StereotypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
