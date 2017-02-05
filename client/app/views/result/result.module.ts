import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';

import { LibSharedModule } from 'fint-shared-components';

import { ResultComponent } from './result.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { StereotypeComponent } from './components/stereotype/stereotype.component';
import { ClassComponent } from './components/class/class.component';

import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';
import { HighlightPipe } from './pipes/highlight.pipe';
import { ExpandablePipe } from './pipes/expandable.pipe';
import { DetailsComponent } from './details/details.component';

@NgModule({
  imports: [
    CommonModule,
    LibSharedModule,
    RouterModule,
    MaterialModule,
    MarkdownToHtmlModule
  ],
  declarations: [
    ResultComponent,
    SidebarComponent,

    StereotypeComponent,
    ClassComponent,

    HighlightPipe,
    ExpandablePipe,
    DetailsComponent
  ]
})
export class ResultModule { }
