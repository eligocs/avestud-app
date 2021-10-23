import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SAssignmentsPageRoutingModule } from './s-assignments-routing.module';

import { SAssignmentsPage } from './s-assignments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SAssignmentsPageRoutingModule
  ],
  declarations: [SAssignmentsPage]
})
export class SAssignmentsPageModule {}
