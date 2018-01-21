import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistroUsuarioPage } from './registro-usuario';

@NgModule({
  declarations: [
    RegistroUsuarioPage,
  ],
  imports: [
    IonicPageModule.forChild(RegistroUsuarioPage),
  ],
})
export class RegistroUsuarioPageModule {}
