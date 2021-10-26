import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartassignmentPageRoutingModule } from './startassignment-routing.module';

import { StartassignmentPage } from './startassignment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartassignmentPageRoutingModule
  ],
  declarations: [StartassignmentPage]
})
export class StartassignmentPageModule {}
