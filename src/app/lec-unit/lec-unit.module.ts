import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LecUnitPageRoutingModule } from './lec-unit-routing.module';

import { LecUnitPage } from './lec-unit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LecUnitPageRoutingModule
  ],
  declarations: [LecUnitPage]
})
export class LecUnitPageModule {}
