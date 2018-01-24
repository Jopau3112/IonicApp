import {Component, ViewChild} from "@angular/core";
import {
  IonicPage, NavController, Slides, AlertController, LoadingController, MenuController,
  ToastController
} from "ionic-angular";
import {ModalController, Platform} from "ionic-angular";
import {AndroidFingerprintAuth} from "@ionic-native/android-fingerprint-auth";
import {TwitterConnect} from '@ionic-native/twitter-connect';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook';
import {GooglePlus} from '@ionic-native/google-plus';

import {FuncionesAuxiliares} from "../../globals/functions.globals";
import {USUARIOS, USUARIO_FACEBOOK_FIREBASE, USUARIO_GOOGLE, USUARIO_TWITTER} from "../../data/usuarios.data";
import {NativePageTransitions} from '@ionic-native/native-page-transitions';
import {OptionsTransitions} from "../../transitions/options.transitions";
//PARA PODER USAR JQUERY
declare var $: any;
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Camera, CameraOptions} from '@ionic-native/camera';

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

  options = new OptionsTransitions();

  fa = new FuncionesAuxiliares();

  splash = true;
  enNavegador = false;

  imagen;

  constructor(public navCtrl: NavController,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              public menuCtrl: MenuController,
              private platform: Platform,
              private afa: AndroidFingerprintAuth,
              private twitter: TwitterConnect,
              private facebook: Facebook,
              private google: GooglePlus,
              public npt: NativePageTransitions,
              private camera: Camera,
              private afAuth: AngularFireAuth) {
    console.log("constructor");
    if (!this.platform.is("cordova")) {
      this.enNavegador = true;
      this.cargarUltimoUsuario();
    } else {
      this.enNavegador = false;
    }
    //Cargamos usuario de prueba: joel-123
    if (!localStorage.getItem("LS_UsuarioLogado")) {
      localStorage.setItem("LS_Usuarios", JSON.stringify(USUARIOS));
    }
  }

  probarCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imagen = base64Image;
      console.log(base64Image);
    }, (err) => {
      // Handle error
    });
  }

  ionViewDidLoad() {
    this.menuCtrl.swipeEnable(false, 'menuIzquierda');
    console.log("splash");
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

  //MOSTRAR TOAST INFORMACION
  showToast(mensaje) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      position: 'middle'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  /*********************************************************************************************************/
  //REALIZAR LOGIN (0:Normal  1:Huella  2:Google  3:Facebook  4:Twitter)
  /*********************************************************************************************************/
  realizarLoginNormal() {
    console.log("Login Normal");
    let loading = this.loadingCtrl.create({
      spinner: 'ios',  //circles
      content: 'Espere...'
    });
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
      loading.dismiss();
      //Redirigir menu principal
      let opcionesTransicion = this.options.optionsFlip;
      opcionesTransicion.direction = "left";
      if (this.platform.is("cordova")) {
        this.npt.flip(opcionesTransicion)
          .then((res) => {
            console.log(res);
            this.navCtrl.push("mi-menu-principal", {
              usuario: this.usuarioApp,
              modo: 0
            }, {animate: false});
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.navCtrl.push("mi-menu-principal", {
          usuario: this.usuarioApp,
          modo: 0
        }, {animate: false});
      }

    } else {
      loading.dismiss();
      this.showAlert();
    }
  }

  realizarLoginHuellaDigital(usuario) {
    if (this.platform.is("cordova")) {
      let loading = this.loadingCtrl.create({
        spinner: 'ios',  //circles
        content: 'Espere...'
      });
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
                      loading.dismiss();
                      //Redirigir menu principal
                      let opcionesTransicion = this.options.optionsFade;
                      this.npt.fade(opcionesTransicion)
                        .then((res) => {
                          console.log(res);
                          this.navCtrl.push("mi-menu-principal", {
                            usuario: usuario,
                            modo: 1
                          }, {animate: false});
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    }
                  }
                } else if (result.withBackup) {
                  console.log("Authenticated with backup password");
                  loading.dismiss();
                  this.navCtrl.push("mi-menu-principal", {
                    usuario: usuario,
                    modo: 1
                  }, {animate: false});
                }
              })
              .catch(error => {
                if (error === "FINGERPRINT_CANCELLED") {
                  console.log("Fingerprint authentication cancelled");
                  this.showToast("Lectura de huella cancelada");
                } else {
                  console.log("Errrrror");
                  console.log(error);
                }
              });
          } else {
            // fingerprint auth isn't available
            loading.dismiss();
          }
        })
        .catch(error => {
          console.log(error);
          loading.dismiss();
        });
    }
  }

  realizarLoginGoogle() {
    console.log("Login Google");
    if (this.platform.is("cordova")) {
      let loading = this.loadingCtrl.create({
        spinner: 'ios',  //circles
        content: 'Espere...'
      });
      loading.present();
      this.google.login({
        'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        'webClientId': '648287590958-teu8qt1h0ea8fcdhe2lbaos3e5ha5feo.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        'offline': false
      })
        .then(res => {
          console.log(res);
          loading.dismiss();
          //Redirigir menu principal
          let usuarioSocial = res;
          this.navCtrl.push("mi-menu-principal", {
            usuario: usuarioSocial,
            modo: 2,
          }, {animation: "wp-transition"});
        })
        .catch(err => {
          console.error(err);
          loading.dismiss();
        });
    } else {
      let usuarioSocial = USUARIO_GOOGLE;
      this.navCtrl.push("mi-menu-principal", {
        usuario: usuarioSocial,
        modo: 2,
      }, {animation: "wp-transition"});
    }
  }

  realizarLoginFacebook() {
    console.log("Login Facebook");
    if (this.platform.is("cordova")) {
      let loading = this.loadingCtrl.create({
        spinner: 'ios',  //circles
        content: 'Espere...'
      });
      this.facebook.login(['public_profile', 'user_friends', 'email'])
        .then((res: FacebookLoginResponse) => {
          console.log('Logged into Facebook!', res)
          if (res.status == 'connected') {
            let userid = res.authResponse.userID;
            this.facebook.api('/' + userid + '/?fields=id,name,email,first_name,picture,last_name,gender', ['public_profile', 'email'])
              .then(data => {
                console.log(data);
                loading.dismiss();
                //Redirigir menu principal
                let usuarioSocial = data;
                this.navCtrl.push("mi-menu-principal", {
                  usuario: usuarioSocial,
                  modo: 3
                });
              })
              .catch(error => {
                console.error(error);
                loading.dismiss();
              });
          } else {
            loading.dismiss();
          }
        })
        .catch(e => {
          console.log('Error logging into Facebook', e);
          loading.dismiss();
        });
      // this.facebook.logEvent(this.facebook.EVENTS.EVENT_NAME_ADDED_TO_CART);
    }
  }

  realizarLoginFacebookFirebase() {
    console.log("Login Facebook Firebase");
    if (this.platform.is("cordova")) {
      let loading = this.loadingCtrl.create({
        spinner: 'ios',  //circles
        content: 'Espere...'
      });
      let provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth.signInWithRedirect(provider).then(() => {
        firebase.auth().getRedirectResult().then((result) => {
          console.log(result);
          loading.dismiss();
          //Redirigir menu principal
          let usuarioSocial = result;
          this.navCtrl.push("mi-menu-principal", {
            usuario: usuarioSocial,
            modo: 3
          });
        }).catch((error) => {
          console.log("error");
          console.log(error);

          loading.dismiss();
        })
      })
    } else {
      let usuarioSocial = USUARIO_FACEBOOK_FIREBASE;
      this.navCtrl.push("mi-menu-principal", {
        usuario: usuarioSocial,
        modo: 3
      });
    }
  }

  realizarLoginTwitter() {
    console.log("Login Twitter");
    if (this.platform.is("cordova")) {
      let loading = this.loadingCtrl.create({
        spinner: 'ios',  //circles
        content: 'Espere...'
      });
      this.twitter.login().then((response) => {
        console.log(response);
        // {
        //   userName: 'myuser',
        //   userId: '12358102',
        //   secret: 'tokenSecret'
        //   token: 'accessTokenHere'
        // }
        this.twitter.showUser().then((user) => {
          console.log(user);
          // {
          //   name: user.name,
          //   userName: user.screen_name,
          //   followers: user.followers_count,
          //   picture: user.profile_image_url_https
          // }
          loading.dismiss();
          //Redirigir menu principal
          let usuarioSocial = user;
          this.navCtrl.push("mi-menu-principal", {
            usuario: usuarioSocial,
            modo: 4
          });
        }, (error) => {
          console.log(error);
          loading.dismiss();
        });
      }, (error) => {
        console.log(error);
        loading.dismiss();
      });
    } else {
      let usuarioSocial = USUARIO_TWITTER;
      this.navCtrl.push("mi-menu-principal", {
        usuario: usuarioSocial,
        modo: 4
      });
    }
  }

  /*********************************************************************************************************/


}
