import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelecttimingsPageRoutingModule } from './selecttimings-routing.module';

import { SelecttimingsPage } from './selecttimings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelecttimingsPageRoutingModule
  ],
  declarations: [SelecttimingsPage]
})
export class SelecttimingsPageModule {}
