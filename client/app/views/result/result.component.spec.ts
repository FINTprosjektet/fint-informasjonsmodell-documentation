/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '@angular/material';

import { LibSharedModule } from 'fint-shared-components';

import { ResultComponent } from './result.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { StereotypeComponent } from "./components/stereotype/stereotype.component";
import { ClassComponent } from "./components/class/class.component";
import { DetailsComponent } from "./details/details.component";
import { ModelService } from "app/EA/model.service";
import { InViewService } from "app/views/result/in-view.service";

describe('ResultComponent', () => {
  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        LibSharedModule,
        RouterTestingModule,
        MaterialModule,
      ],
      declarations: [
        ResultComponent,
        SidebarComponent,
        StereotypeComponent,
        ClassComponent,
        DetailsComponent
      ],
      providers: [ModelService, InViewService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
