import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  Slides,
  AlertController
} from "ionic-angular";
import { ModalController, Platform } from "ionic-angular";
import { FuncionesAuxiliares } from "../../globals/functions.globals";
import { AndroidFingerprintAuth } from "@ionic-native/android-fingerprint-auth";
//PARA PODER USAR JQUERY
declare var $: any;

@IonicPage({
  name: "mi-login"
})
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  usuario: any = {
    username: "",
    password: ""
  };

  usuarioApp: any = {};

  recordarme = true;
  passwordOculto = true;

  @ViewChild(Slides) slides: Slides;
  sliderOptions: any = {
    effect: "cube",
    noSwiping: true,
    direction: "vertical"
  };

  fa = new FuncionesAuxiliares();

  splash = true;
  enNavegador = false;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private afa: AndroidFingerprintAuth
  ) {
    console.log("constructor");
    if (!this.platform.is("cordova")) {
      this.enNavegador = true;
      this.cargarUltimoUsuario();
    } else {
      this.enNavegador = false;
    }
  }

  ionViewDidLoad() {
    console.log("vista");
    if (this.platform.is("cordova")) {
      setTimeout(() => {
        this.splash = false;
        //Cargar ultimo usuario logado
        this.cargarUltimoUsuario();
      }, 3000);
    }
  }

  //CARGAR ULTIMO USUARIO LOGADO
  cargarUltimoUsuario() {
    if (localStorage.getItem("LS_UsuarioLogado")) {
      this.usuario = JSON.parse(localStorage.getItem("LS_UsuarioLogado"));
      console.log(this.usuario);
      let users = [];
      if (localStorage.getItem("LS_Usuarios")) {
        users = JSON.parse(localStorage.getItem("LS_Usuarios"));
      }
      this.usuarioApp = this.fa.devolverUsuarioAplicacion(this.usuario, users);
      console.log(this.usuarioApp);
      console.log("Lector Huella");
      if (this.usuarioApp.tieneHuella) {
        this.realizarLoginHuellaDigital(this.usuarioApp);
      }
    }
  }

  //MOSTRAR U OCULTAR CONTRASEÑA
  mostrarOcultarPassword() {
    if (this.passwordOculto) {
      $("#password").attr("style", "-webkit-text-security:none !important");
    } else {
      $("#password").attr("style", "-webkit-text-security:disc !important");
    }
    this.passwordOculto = !this.passwordOculto;
  }

  //ABRIR MODAL RECUPERAR CONTRASEÑA
  abrirModalRecuperar() {
    this.modalCtrl
      .create(
        "mi-recuperar-password",
        {},
        {
          enterAnimation: "modal-slide-right-enter",
          leaveAnimation: "modal-slide-right-leave"
        }
      )
      .present();
  }

  //ABRIR MODAL REGISTRO DE USUARIO
  abrirModalRegistro() {
    this.modalCtrl.create("mi-registro-usuario").present();
  }

  //MOSTRAR ALERT INFORMACION
  showAlert() {
    let alert = this.alertCtrl.create({
      title: "LOGIN",
      subTitle: "Datos introducidos incorrectos.<br>Inténtelo de nuevo.",
      buttons: ["Aceptar"]
    });
    alert.present();
  }

  //LOGIN CON USUARIO NORMAL
  realizarLoginNormal() {
    console.log("Login Normal");
    //Servicio Login
    let users = [];
    if (localStorage.getItem("LS_Usuarios")) {
      users = JSON.parse(localStorage.getItem("LS_Usuarios"));
    }
    if (this.fa.devolverUsuarioAplicacion(this.usuario, users)) {
      if (this.recordarme) {
        localStorage.setItem("LS_UsuarioLogado", JSON.stringify(this.usuario));
      } else {
        localStorage.removeItem("LS_UsuarioLogado");
      }
      //Rootscope usuario
      this.usuarioApp = this.fa.devolverUsuarioAplicacion(this.usuario, users);

      //Redirigir menu principal
      this.navCtrl.push("mi-menu-principal", {
        usuario: this.usuarioApp
      });
    } else {
      this.showAlert();
    }
  }

  //LOGIN HUELLA DIGITAL
  successCallback(result) {
    console.log("successCallback(): " + JSON.stringify(result));
    if (result.withFingerprint) {
      console.log("Successful biometric authentication.");
      if (result.password) {
        console.log("Successfully decrypted credential token.");
        console.log("password: " + result.password);
      }
    } else if (result.withBackup) {
      console.log("Authenticated with backup password");
    }
  }
  errorCallback(error) {
    if (error === this.afa.ERRORS.FINGERPRINT_CANCELLED) {
      console.log("FingerprintAuth Dialog Cancelled!");
    } else {
      console.log("FingerprintAuth Error: " + error);
    }
  }
  realizarLoginHuellaDigital(usuario) {
    if (this.platform.is("cordova")) {
      this.afa
        .isAvailable()
        .then(result => {
          if (result.isAvailable) {
            //it is available
            this.afa
              .decrypt({
                clientId: "joel.ionicapp",
                username: usuario.user,
                token: usuario.tokenHuella,
                locale: "es"
              })
              .then(result => {
                if (result.withFingerprint) {
                  console.log("Successful biometric authentication.");
                  if (result.password) {
                    console.log("Successfully decrypted credential token.");
                    console.log("password: " + result.password);
                    if (result.password == usuario.password) {
                      console.log("Login Huella Digital");
                      //Redirigir menu principal
                      this.navCtrl.push("mi-menu-principal", {
                        usuario: usuario
                      });
                    }
                  }
                } else if (result.withBackup) {
                  console.log("Authenticated with backup password");
                }
              })
              .catch(error => {
                if (error === this.afa.ERRORS.FINGERPRINT_CANCELLED) {
                  console.log("Fingerprint authentication cancelled");
                } else console.log(error);
              });
          } else {
            // fingerprint auth isn't available
          }
        })
        .catch(error => console.log(error));
    }
  }

  realizarLoginGoogle() {
    console.log("Login Google");
  }

  realizarLoginFacebook() {
    console.log("Login Facebook");
  }

  realizarLoginTwitter() {
    console.log("Login Twitter");
  }

  alerta() {
    alert("Prueba alerta");
  }
  // if (!this.platform.is('cordova')) {}
}
