import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { ResultComponent } from './result.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { StereotypeComponent } from './components/stereotype/stereotype.component';
import { ClassComponent } from './components/class/class.component';
import { PackageComponent } from './components/package/package.component';
import { AssociationComponent } from './components/association/association.component';

import { HighlightPipe } from './pipes/highlight.pipe';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    ResultComponent,
    SidebarComponent,

    StereotypeComponent,
    ClassComponent,
    PackageComponent,
    AssociationComponent,

    HighlightPipe
  ]
})
export class ResultModule { }
