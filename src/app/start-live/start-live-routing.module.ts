import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartLivePage } from './start-live.page';

const routes: Routes = [
  {
    path: '',
    component: StartLivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartLivePageRoutingModule {}
