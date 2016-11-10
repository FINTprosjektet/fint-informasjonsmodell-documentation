import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaComponent } from './fontawesome/fa.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FaComponent],
  exports: [FaComponent]
})
export class SharedModule { }
