import { __platform_browser_private__, BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule, Request, XSRFStrategy } from '@angular/http';
//import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';

import { StereotypeComponent } from './components/stereotype/stereotype.component';
import { ClassComponent } from './components/class/class.component';
import { PackageComponent } from './components/package/package.component';
import { AssociationComponent } from './components/association/association.component';

export class MyXSRFStrategy {
  configureRequest(req: Request) {
    // Remove `x-xsrf-token` from request headers
  }
}

@NgModule({
  declarations: [
    AppComponent,
    StereotypeComponent,
    ClassComponent,
    PackageComponent,
    AssociationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,

    SharedModule
    //AppRoutingModule
  ],
  providers: [{ provide: XSRFStrategy, useFactory: () => new MyXSRFStrategy() }], // !!HACK!!
  bootstrap: [AppComponent]
})
export class AppModule { }
