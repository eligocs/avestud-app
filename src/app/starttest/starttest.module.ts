import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StarttestPageRoutingModule } from './starttest-routing.module';

import { StarttestPage } from './starttest.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StarttestPageRoutingModule
  ],
  declarations: [StarttestPage]
})
export class StarttestPageModule {}
