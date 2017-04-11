/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { LibSharedModule } from 'fint-shared-components';

import { SidebarComponent } from './sidebar.component';
import { InViewService } from "app/views/result/in-view.service";

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        LibSharedModule,
        RouterTestingModule
      ],
      declarations: [ SidebarComponent ],
      providers: [InViewService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
