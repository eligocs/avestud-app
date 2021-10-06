import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnrollmentsPageRoutingModule } from './enrollments-routing.module';

import { EnrollmentsPage } from './enrollments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnrollmentsPageRoutingModule
  ],
  declarations: [EnrollmentsPage]
})
export class EnrollmentsPageModule {}
