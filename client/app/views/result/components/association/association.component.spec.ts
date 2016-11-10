/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AssociationComponent } from './association.component';

describe('AssociationComponent', () => {
  let component: AssociationComponent;
  let fixture: ComponentFixture<AssociationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
