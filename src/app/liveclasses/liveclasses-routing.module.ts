import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiveclassesPage } from './liveclasses.page';

const routes: Routes = [
  {
    path: '',
    component: LiveclassesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveclassesPageRoutingModule {}
