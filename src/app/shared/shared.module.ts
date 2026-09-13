import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular/lazy';

import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [MenuComponent],
  imports: [CommonModule, IonicModule, RouterModule],
  exports: [MenuComponent],
})
export class SharedModule {}
