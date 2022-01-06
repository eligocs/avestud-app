import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoubtMessagesPage } from './doubt-messages.page';

const routes: Routes = [
  {
    path: '',
    component: DoubtMessagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoubtMessagesPageRoutingModule {}
