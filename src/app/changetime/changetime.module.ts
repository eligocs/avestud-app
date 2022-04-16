import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangetimePageRoutingModule } from './changetime-routing.module';

import { ChangetimePage } from './changetime.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangetimePageRoutingModule
  ],
  declarations: [ChangetimePage]
})
export class ChangetimePageModule {}
