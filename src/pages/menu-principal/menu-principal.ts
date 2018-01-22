import {Component} from "@angular/core";
import {
  IonicPage, NavController, NavParams, App, Platform, AlertController, ToastController,
  MenuController, MenuToggle
} from "ionic-angular";
import {AndroidFingerprintAuth} from "@ionic-native/android-fingerprint-auth";
import {TwitterConnect} from '@ionic-native/twitter-connect';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook';
import {GooglePlus} from '@ionic-native/google-plus';

import {FuncionesAuxiliares} from "../../globals/functions.globals";
import {trigger, state, animate, transition, style} from '@angular/animations';

@IonicPage({
  name: "mi-menu-principal"
})
@Component({
  selector: "page-menu-principal",
  templateUrl: "menu-principal.html",
  animations: [
    trigger('myTriggerName', [
      state('on', style({opacity: 1})),
      state('off', style({opacity: 0})),
      transition('on => off', [
        animate("1s")
      ])
    ])
  ]

})


export class MenuPrincipalPage {
  usuarioLogado: any;
  modoEntrada: number;  //(0:Normal  1:Huella  2:Google  3:Facebook  4:Twitter)

  fa = new FuncionesAuxiliares();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public appCtrl: App,
              private platform: Platform,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              public menuCtrl: MenuController,
              private afa: AndroidFingerprintAuth,
              private twitter: TwitterConnect,
              private facebook: Facebook,
              private google: GooglePlus) {
    //Recogemos parametros
    this.usuarioLogado = this.navParams.get("usuario");
    this.modoEntrada = this.navParams.get("modo");
    console.log(this.usuarioLogado);
    console.log("Modo:" + this.modoEntrada);
    //Volver a inicio
    if (!this.usuarioLogado) {
      this.appCtrl.getRootNav().push("mi-login");
    } else {
      // this.showToast("Huella no detectada correctamente");
      if (this.modoEntrada == 0) {
        if (!this.usuarioLogado.tieneHuella) {
          //Verificamos si el dispositivo tiene lector de huella
          this.verificarLectorHuella();
        } else {
          console.log("Usuario con huella registrada");
        }
      }

    }
  }

  ionViewDidLoad() {
    this.menuCtrl.swipeEnable(true, 'menuIzquierda');
  }

  //MOSTRAR INFORMACION HUELLA DIGITAL
  showConfirm() {
    let alert = this.alertCtrl.create({
      title: "ENTRAR CON HUELLA",
      message:
        "<div class='img-container'><img src='assets/imgs/huella.png' width='90'></div>Si activas la huella, podrás acceder a la aplicación de una forma más rápida y más cómoda.",
      buttons: [
        {
          text: "SALTAR",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "HABILITAR",
          handler: () => {
            this.registrarHuella();
          }
        }
      ]
    });
    alert.present();
  }

  //MOSTRAR INFORMACION HUELLA DIGITAL
  showAlert() {
    let alert = this.alertCtrl.create({
      title: "HUELLA ACTIVADA",
      subTitle:
        "<div class='img-container'><img src='assets/imgs/huella-activada.png' width='90'></div>A partir de ahora podrás entrar con tu huella en la aplicación.",
      buttons: ["Aceptar"]
    });
    alert.present();
  }

  //MOSTRAR TOAST INFORMACION
  showToast(mensaje) {
    let toast = this.toastCtrl.create({
      message: mensaje,

      duration: 3000,
      position: "middle"
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }

  //VERIFICAR DISPOSITIVO TIENE LECTOR HUELLA
  verificarLectorHuella() {
    if (this.platform.is("cordova")) {
      this.afa
        .isAvailable()
        .then(result => {
          if (result.isAvailable) {
            // it is available
            this.showConfirm();
          } else {
            // fingerprint auth isn't available
            console.log("fingerprint auth isn't available");
          }
        })
        .catch(error => console.error(error));
    } else {
      console.log("Lector de Huella en el Movil");
    }
  }

  //REGISTRA LA HUELLA DIGITAL ASOCIADA AL USUARIO LOGADO
  registrarHuella() {
    this.afa
      .isAvailable()
      .then(result => {
        if (result.isAvailable) {
          // it is available
          this.afa
            .encrypt({
              clientId: "joel.ionicapp",
              username: this.usuarioLogado.user,
              password: this.usuarioLogado.password,
              locale: "es"
            })
            .then(result => {
              if (result.withFingerprint) {
                console.log("Successfully encrypted credentials.");
                console.log("Encrypted credentials: " + result.token);
                this.usuarioLogado.permiteHuella = true;
                this.usuarioLogado.tieneHuella = true;
                this.usuarioLogado.tokenHuella = result.token;
                this.fa.actualizarUsuario(this.usuarioLogado);
              } else if (result.withBackup) {
                console.log("Successfully authenticated with backup password!");
              } else {
                console.log("Didn't authenticate!");
              }
            })
            .catch(error => {
              if (error === this.afa.ERRORS.FINGERPRINT_CANCELLED) {
                console.log("Fingerprint authentication cancelled");
              } else console.error(error);
            });
        } else {
          // fingerprint auth isn't available
        }
      })
      .catch(error => console.error(error));
  }

  /*********************************************************************************************************/
  //REALIZAR LOGOUT
  /*********************************************************************************************************/
  realizarLogoutNormal() {
    this.navCtrl.pop();
  }

  realizarLogoutGoogle() {
    console.log("Logout Google");
    this.google.logout().then((response) => {
      console.log(response);
      this.navCtrl.pop();
    }, (error) => {
      console.log(error);
    });
  }

  realizarLogoutFacebook() {
    console.log("Logout Facebook");
    if (this.platform.is("cordova")) {
      this.facebook.logout()
        .then((res: FacebookLoginResponse) => {
          console.log(res);
          this.navCtrl.pop();
        })
        .catch(e => console.log('Error logging into Facebook', e));
      // this.facebook.logEvent(this.facebook.EVENTS.EVENT_NAME_ADDED_TO_CART);
    }
  }

  realizarLogoutTwitter() {
    console.log("Logout Twitter");
    if (this.platform.is("cordova")) {
      this.twitter.logout().then((response) => {
        console.log(response);
        this.navCtrl.pop();
      }, (error) => {
        console.log(error);
      });
    }

  }

  /*********************************************************************************************************/
}
