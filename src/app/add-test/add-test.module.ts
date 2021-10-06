import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddTestPageRoutingModule } from './add-test-routing.module';

import { AddTestPage } from './add-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddTestPageRoutingModule
  ],
  declarations: [AddTestPage]
})
export class AddTestPageModule {}
