import { Routes } from '@angular/router';

import { ResultComponent } from './result.component';

export const ResultRoutes: Routes = [
  {
    path: 'docs', children: [
      { path: '', component: ResultComponent, pathMatch: 'full' },
      { path: ':id', component: ResultComponent, pathMatch: 'full' },
      { path: ':id/:attribute', component: ResultComponent, pathMatch: 'full' }
    ]
  }
];
