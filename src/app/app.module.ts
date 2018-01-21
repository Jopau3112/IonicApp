import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";

import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { AndroidFingerprintAuth } from "@ionic-native/android-fingerprint-auth";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { Config } from "ionic-angular";
import {
  ModalScaleUpEnterTransition,
  ModalScaleUpLeaveTransition,
  ModalFadeInEnterTransition,
  ModalFadeInLeaveTransition,
  ModalSlideRightEnterTransition,
  ModalSlideRightLeaveTransition
} from "../transitions/index.transition";

ModalFadeInEnterTransition;
import { MyApp } from "./app.component";
import { RootScopeService } from "../providers/root-scope/root-scope";

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp)
    //IonicModule.forRoot(MyApp, { animate: false })  Quitar animaciones
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    SplashScreen,
    AndroidFingerprintAuth,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    RootScopeService
  ]
})
export class AppModule {
  constructor(public config: Config) {
    this.setCustomTransitions();
  }

  //Estableciendo Transiciones
  private setCustomTransitions() {
    this.config.setTransition(
      "modal-scale-up-leave",
      ModalScaleUpLeaveTransition
    );
    this.config.setTransition(
      "modal-scale-up-enter",
      ModalScaleUpEnterTransition
    );
    this.config.setTransition(
      "modal-fade-in-leave",
      ModalFadeInLeaveTransition
    );
    this.config.setTransition(
      "modal-fade-in-enter",
      ModalFadeInEnterTransition
    );
    this.config.setTransition(
      "modal-slide-right-leave",
      ModalSlideRightLeaveTransition
    );
    this.config.setTransition(
      "modal-slide-right-enter",
      ModalSlideRightEnterTransition
    );
  }
}
