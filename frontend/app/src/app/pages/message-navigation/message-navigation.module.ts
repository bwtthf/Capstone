import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessageNavigationPageRoutingModule } from './message-navigation-routing.module';

import { MessageNavigationPage } from './message-navigation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessageNavigationPageRoutingModule
  ],
  declarations: [MessageNavigationPage]
})
export class MessageNavigationPageModule {}
