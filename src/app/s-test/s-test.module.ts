import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { STestPageRoutingModule } from './s-test-routing.module';

import { STestPage } from './s-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    STestPageRoutingModule
  ],
  declarations: [STestPage]
})
export class STestPageModule {}
