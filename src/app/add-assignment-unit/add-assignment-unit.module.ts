import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddAssignmentUnitPageRoutingModule } from './add-assignment-unit-routing.module';

import { AddAssignmentUnitPage } from './add-assignment-unit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddAssignmentUnitPageRoutingModule
  ],
  declarations: [AddAssignmentUnitPage]
})
export class AddAssignmentUnitPageModule {}
