import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublishAssignmentPageRoutingModule } from './publish-assignment-routing.module';

import { PublishAssignmentPage } from './publish-assignment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublishAssignmentPageRoutingModule
  ],
  declarations: [PublishAssignmentPage]
})
export class PublishAssignmentPageModule {}
