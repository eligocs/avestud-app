import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { EnrollmentsPageRoutingModule } from './enrollments-routing.module';

import { EnrollmentsPage } from './enrollments.page'; 
@NgModule({
  imports: [ 
    CommonModule,
    FormsModule,
    IonicModule,
    EnrollmentsPageRoutingModule
  ],
  providers: [AndroidPermissions],
  declarations: [EnrollmentsPage], 
})
export class EnrollmentsPageModule {}
