import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddExtraClassPageRoutingModule } from './add-extra-class-routing.module';

import { AddExtraClassPage } from './add-extra-class.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddExtraClassPageRoutingModule
  ],
  declarations: [AddExtraClassPage]
})
export class AddExtraClassPageModule {}
