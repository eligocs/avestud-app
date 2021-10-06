import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddTestUnitPageRoutingModule } from './add-test-unit-routing.module';

import { AddTestUnitPage } from './add-test-unit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddTestUnitPageRoutingModule
  ],
  declarations: [AddTestUnitPage]
})
export class AddTestUnitPageModule {}
