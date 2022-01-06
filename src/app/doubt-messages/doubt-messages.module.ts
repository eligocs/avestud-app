import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoubtMessagesPageRoutingModule } from './doubt-messages-routing.module';

import { DoubtMessagesPage } from './doubt-messages.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoubtMessagesPageRoutingModule
  ],
  declarations: [DoubtMessagesPage]
})
export class DoubtMessagesPageModule {}
