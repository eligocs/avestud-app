import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelecttimingsPage } from './selecttimings.page';

const routes: Routes = [
  {
    path: '',
    component: SelecttimingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelecttimingsPageRoutingModule {}
