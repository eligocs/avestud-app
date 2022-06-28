import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiveclassesPageRoutingModule } from './liveclasses-routing.module';

import { LiveclassesPage } from './liveclasses.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiveclassesPageRoutingModule
  ],
  declarations: [LiveclassesPage]
})
export class LiveclassesPageModule {}
