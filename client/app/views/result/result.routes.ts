import { Routes } from '@angular/router';

import { ResultComponent } from './result.component';

export const ResultRoutes: Routes = [
  {
    path: 'api', children: [
      { path: '', component: ResultComponent, pathMatch: 'full' }
    ]
  }
];
