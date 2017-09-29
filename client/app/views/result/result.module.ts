import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatChipsModule, MatCardModule } from '@angular/material';
// import { MaterialModule } from '@angular/material';

// import { LibSharedModule } from 'fint-shared-components';
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';

import { InViewService } from './in-view.service';

import { DetailsComponent } from './details/details.component';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';
import { HighlightPipe } from './pipes/highlight.pipe';
import { ExpandablePipe } from './pipes/expandable.pipe';

import { ResultRoutes } from './result.routes';
import { ResultComponent } from './result.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { StereotypeComponent } from './components/stereotype/stereotype.component';
import { ClassComponent } from './components/class/class.component';

@NgModule({
  imports: [
    CommonModule,
    // MaterialModule,
    // LibSharedModule,
    AngularFontAwesomeModule,
    RouterModule,
    MarkdownToHtmlModule,
    MatCardModule,
    MatChipsModule
  ],
  declarations: [
    ResultComponent,
    SidebarComponent,

    StereotypeComponent,
    ClassComponent,

    HighlightPipe,
    ExpandablePipe,
    DetailsComponent
  ],
  providers: [InViewService]
})
export class ResultModule { }
