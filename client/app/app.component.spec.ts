/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { LibSharedModule } from 'fint-shared-components';

import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ModelService } from './EA/model.service';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        MaterialModule,
        LibSharedModule,
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [ModelService],
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  // it(`should have as title 'app works!'`, async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('app works!');
  // }));

  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('app works!');
  // }));
});
