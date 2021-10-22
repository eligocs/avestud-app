import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchclassPage } from './searchclass.page';

const routes: Routes = [
  {
    path: '',
    component: SearchclassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchclassPageRoutingModule {}
