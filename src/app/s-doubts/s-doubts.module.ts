import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SDoubtsPageRoutingModule } from './s-doubts-routing.module';

import { SDoubtsPage } from './s-doubts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SDoubtsPageRoutingModule
  ],
  declarations: [SDoubtsPage]
})
export class SDoubtsPageModule {}
