import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { STestPage } from './s-test.page';

const routes: Routes = [
  {
    path: '',
    component: STestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class STestPageRoutingModule {}
