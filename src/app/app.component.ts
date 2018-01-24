import {Component} from "@angular/core";
import {Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {RootScopeService} from "../providers/rootscope/rootscope.service";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: any = "mi-login";
  usuario: any;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private _rss: RootScopeService) {
    if (platform.is("cordova")) {
      platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.styleDefault();
        // splashScreen.hide();
      });
    }
    //CARGAR VALOR DEL SERVICIO USANDO OBSERVABLE (ROOTSCOPE)
    this._rss.dataChange.subscribe(data => {
      this.usuario = data;
    });
  }
}
