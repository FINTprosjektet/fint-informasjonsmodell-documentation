import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Request } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { LibSharedModule } from 'fint-shared-components';
import { AppRoutingModule } from './app-routing.module';
import { ResultModule } from './views/result/result.module';

import { ModelService } from './EA/model.service';

import { AppComponent } from './app.component';
import { ModelComponent } from './views/model/model.component';

@NgModule({
  declarations: [
    AppComponent,
    ModelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    LibSharedModule,
    AppRoutingModule,
    ResultModule
  ],
  providers: [ModelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
