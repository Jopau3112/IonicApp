import {Component} from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  App,
  Platform,
  AlertController,
  ToastController,
  MenuController
} from "ionic-angular";
import {AndroidFingerprintAuth} from "@ionic-native/android-fingerprint-auth";
import {TwitterConnect} from "@ionic-native/twitter-connect";
import {Facebook, FacebookLoginResponse} from "@ionic-native/facebook";
import {GooglePlus} from "@ionic-native/google-plus";

import {RootScopeService} from "../../providers/rootscope/rootscope.service";
import {FuncionesAuxiliares} from "../../globals/functions.globals";
// import {fadeInAnimation, routerAnimation, slideInOutAnimation} from "../../animations/index.animations";
// import {NativePageTransitions} from '@ionic-native/native-page-transitions';
// import {USUARIO_FACEBOOK_FIREBASE, USUARIO_GOOGLE, USUARIO_TWITTER} from "../../data/usuarios.data";

import {AngularFireAuth} from 'angularfire2/auth';

// import * as firebase from 'firebase/app';

@IonicPage({
  name: "mi-menu-principal"
})
@Component({
  selector: "page-menu-principal",
  templateUrl: "menu-principal.html"
  // animations: [slideInOutAnimation()],
  // host: {'[@slideInOutAnimation]': ''
  // }
})

export class MenuPrincipalPage {
  usuarioLogado: any;
  usuarioMostrado: any = {};
  modoEntrada: number; //(0:Normal  1:Huella  2:Google  3:Facebook  4:Twitter)

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
              private google: GooglePlus,
              private _rss: RootScopeService,
              private afAuth: AngularFireAuth) {
    //Recogemos parametros
    this.usuarioLogado = this.navParams.get("usuario");
    this.modoEntrada = this.navParams.get("modo");
    console.log("USUARIO:");
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
      this.generarUsuario(this.modoEntrada);
    }
  }

  ionViewDidLoad() {
    this.menuCtrl.swipeEnable(true, "menuIzquierda");
  }

  //GENERAR USUARIO GENERICO DEPENDIENDO DEL MODO DE ENTRADA
  generarUsuario(modo) {
    let user = {
      nombre: "",
      apellidos: "",
      imagen: ""
    };
    //(0:Normal  1:Huella  2:Google  3:Facebook  4:Twitter)
    switch (modo) {
      case 2:
        user.nombre = this.usuarioLogado.givenName;
        user.apellidos = this.usuarioLogado.familyName;
        user.imagen = this.usuarioLogado.imageUrl;
        break;
      case 3:
        user.nombre = this.usuarioLogado.additionalUserInfo.profile.first_name;
        user.apellidos = this.usuarioLogado.additionalUserInfo.profile.last_name;
        user.imagen = this.usuarioLogado.additionalUserInfo.profile.picture.data.url;
        break;
      case 4:
        user.nombre = this.usuarioLogado.name;
        user.apellidos = "";
        user.imagen = this.usuarioLogado.profile_image_url_https;
        break;
      default:
        user.nombre = this.usuarioLogado.nombre;
        user.apellidos = this.usuarioLogado.apellidos;
        user.imagen = "http://www.tipsaludable.com/wp-content/uploads/2017/08/b1-8.jpg";
        break;
    }
    // Actualizando valor del usuario info usando el servicio
    this._rss.setData(user);
    this.usuarioMostrado = user;
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
  realizarLogout() {
    let modo = this.modoEntrada;
    if (!this.platform.is("cordova")) {
      this.realizarLogoutNormal();
    } else {
      //(0:Normal  1:Huella  2:Google  3:Facebook  4:Twitter)
      switch (modo) {
        case 2:
          this.realizarLogoutGoogle();
          break;
        case 3:
          this.realizarLogoutFacebookFirebase();
          break;
        case 4:
          this.realizarLogoutTwitter();
          break;
        default:
          this.realizarLogoutNormal();
          break;
      }
    }
  }

  realizarLogoutNormal() {
    this.navCtrl.pop();
  }

  realizarLogoutGoogle() {
    console.log("Logout Google");
    this.google.logout().then(
      response => {
        console.log(response);
        this.navCtrl.pop();
      },
      error => {
        console.log(error);
      }
    );
  }

  realizarLogoutFacebook() {
    console.log("Logout Facebook");
    this.facebook
      .logout()
      .then((res: FacebookLoginResponse) => {
        console.log(res);
        this.navCtrl.pop();
      })
      .catch(e => console.log("Error logging into Facebook", e));
  }

  realizarLogoutFacebookFirebase() {
    console.log("Logout Facebook Firebase");
    if (this.platform.is("cordova")) {
      this.afAuth.auth.signOut();
      this.navCtrl.pop();
    }
  }

  realizarLogoutTwitter() {
    console.log("Logout Twitter");
    this.twitter.logout().then(
      response => {
        console.log(response);
        this.navCtrl.pop();
      },
      error => {
        console.log(error);
      }
    );
  }

  /*********************************************************************************************************/
}
