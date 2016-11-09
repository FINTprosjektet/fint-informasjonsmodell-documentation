import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaComponent } from './fontawesome/fa.component';
import { SidebarComponent } from './sidebar/sidebar.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FaComponent, SidebarComponent],
  exports: [FaComponent, SidebarComponent]
})
export class SharedModule { }
