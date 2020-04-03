import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchesPageRoutingModule } from './matches-routing.module';

import { MatchesPage } from './matches.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatchesPageRoutingModule
  ],
  declarations: [MatchesPage]
})
export class MatchesPageModule {}
