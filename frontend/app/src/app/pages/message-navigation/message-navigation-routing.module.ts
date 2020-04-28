import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MessageNavigationPage } from './message-navigation.page';

const routes: Routes = [
  {
    path: '',
    component: MessageNavigationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessageNavigationPageRoutingModule {}
