import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemovideoPage } from './demovideo.page';

const routes: Routes = [
  {
    path: '',
    component: DemovideoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemovideoPageRoutingModule {}
