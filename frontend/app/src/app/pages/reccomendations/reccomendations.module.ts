import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReccomendationsPageRoutingModule } from './reccomendations-routing.module';

import { ReccomendationsPage } from './reccomendations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReccomendationsPageRoutingModule
  ],
  declarations: [ReccomendationsPage]
})
export class ReccomendationsPageModule {}
