import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SExtraclassesPage } from './s-extraclasses.page';

const routes: Routes = [
  {
    path: '',
    component: SExtraclassesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SExtraclassesPageRoutingModule {}
