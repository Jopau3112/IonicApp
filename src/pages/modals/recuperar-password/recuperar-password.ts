import { Component } from "@angular/core";
import { IonicPage, ViewController, AlertController } from "ionic-angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { patternValidator } from "../../../shared/pattern-validator";

@IonicPage({
  name: "mi-recuperar-password"
})
@Component({
  selector: "page-recuperar-password",
  templateUrl: "recuperar-password.html"
})
export class RecuperarPasswordPage {
  usuario: any = {
    email: ""
  };
  //Reactive Forms Angular
  formulario: FormGroup;

  constructor(
    private viewCtrl: ViewController,
    private alertCtrl: AlertController
  ) {
    this.createForm();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad RecuperarPasswordPage");
  }

  //CREAMOS FORMULARIO MEDIANTE FORMGROUP Y ASIGNAMOS VALIDACIONES
  private createForm() {
    this.formulario = new FormGroup({
      correo: new FormControl("", [
        Validators.required,
        patternValidator(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      ])
    });
  }

  //MOSTRAR ALERT INFORMACION
  showAlert() {
    let alert = this.alertCtrl.create({
      title: "RECUPERAR CONTRASEÑA",
      subTitle:
        "Revise su correo electrónico para poder recuperar su contraseña.",
      buttons: ["Aceptar"]
    });
    alert.present();
  }

  //ENVIAR EMAIL USANDO PLUGIN 'EMAILCOMPOSER' AL INTRODUCIDO EN EL INPUT
  // enviarEmail() {
  //   let password = "123";
  //   this.emailComposer.isAvailable().then((available: boolean) => {
  //     if (available) {
  //       //Now we know we can send
  //       console.log("Email Composer available");
  //     } else {
  //       console.log("Email Composer not available");
  //     }
  //   });
  //   let email = {
  //     to: this.usuario.email,
  //     cc: "",
  //     bcc: [],
  //     attachments: [],
  //     subject: "Recuperación contraseña",
  //     body:
  //       "Hola!!!<br><br>Su contraseña es: " + password + ".<br><br>Saludos.",
  //     isHtml: true
  //   };
  //   // Send a text message using default options
  //   this.emailComposer.open(email);
  // }

  //METODO LANZADO AL PULSAR BOTON RECUPERAR
  recuperarPassword() {
    console.log(this.usuario);
    this.showAlert();
    this.cerrarModalRecuperar();
    // if (this.platform.is("cordova")) {
    //   this.enviarEmail();
    // }
  }

  //CERRAR MODAL RECUPERAR PASSWORD
  cerrarModalRecuperar() {
    this.viewCtrl.dismiss();
  }
}
