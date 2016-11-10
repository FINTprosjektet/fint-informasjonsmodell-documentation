import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Request, XSRFStrategy } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { ResultModule } from './views/result/result.module';

import { ModelService } from './EA/model.service';

import { AppComponent } from './app.component';

import { ModelComponent } from './views/model/model.component';

export class MyXSRFStrategy {
  configureRequest(req: Request) {
    // Remove `x-xsrf-token` from request headers
  }
}

@NgModule({
  declarations: [
    AppComponent,
    ModelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    AppRoutingModule,
    SharedModule,
    ResultModule
  ],
  providers: [ModelService, { provide: XSRFStrategy, useFactory: () => new MyXSRFStrategy() }], // !!HACK!!
  bootstrap: [AppComponent]
})
export class AppModule { }
