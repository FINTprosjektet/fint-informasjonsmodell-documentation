import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultRoutes } from './views/result/result.routes';
import { ModelComponent } from './views/model/model.component';

const routes: Routes = [
  { path: '', component: ModelComponent, pathMatch: 'full' },
  ...ResultRoutes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
