import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddExtraClassPage } from './add-extra-class.page';

const routes: Routes = [
  {
    path: '',
    component: AddExtraClassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddExtraClassPageRoutingModule {}
