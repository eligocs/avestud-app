import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddTestPage } from './add-test.page';

const routes: Routes = [
  {
    path: '',
    component: AddTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddTestPageRoutingModule {}
