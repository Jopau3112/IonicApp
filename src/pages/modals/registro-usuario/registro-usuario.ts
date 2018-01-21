import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  ViewController,
  AlertController,
  Slides
} from "ionic-angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { patternValidator } from "../../../shared/pattern-validator";
import { ModalController } from "ionic-angular";
import { RootScopeService } from "../../../providers/root-scope/root-scope";
import { FuncionesAuxiliares } from "../../../globals/functions.globals";

@IonicPage({
  name: "mi-registro-usuario"
})
@Component({
  selector: "page-registro-usuario",
  templateUrl: "registro-usuario.html"
})
export class RegistroUsuarioPage {
  usuario: any = {
    nombre: "",
    apellidos: "",
    fechaNacimiento: "",
    email: "",
    user: "",
    password: "",
    confirmPassword: ""
  };
  //Reactive Forms Angular
  formulario: FormGroup;

  //Animaciones Modales
  @ViewChild(Slides) slides: Slides;
  sliderOptions: any = {
    effect: "cube",
    noSwiping: true,
    direction: "vertical"
  };

  fa = new FuncionesAuxiliares();

  constructor(
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private _rss: RootScopeService
  ) {
    this.createForm();
    //CARGAR VALOR DEL SERVICIO USANDO OBSERVABLE (ROOTSCOPE)
    this._rss.dataChange.subscribe(data => {
      console.log("FECHA ELEGIDA EN MODAL:" + data);
      this.usuario.fechaNacimiento = data;
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad RegistroUsuarioPage");
  }

  //CREAMOS FORMULARIO MEDIANTE FORMGROUP Y ASIGNAMOS VALIDACIONES
  private createForm() {
    this.formulario = new FormGroup(
      {
        nombre: new FormControl("", Validators.required),
        apellidos: new FormControl("", Validators.required),
        fecha: new FormControl("", Validators.required),
        correo: new FormControl("", [
          Validators.required,
          patternValidator(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
        ]),
        usuario: new FormControl("", [
          Validators.required,
          Validators.minLength(4)
        ]),
        contrasenia: new FormControl("", [
          Validators.required,
          Validators.minLength(3)
        ]),
        confirmContrasenia: new FormControl("", Validators.required)
      },
      this.passwordMatchValidator
    );
  }
  // }, {validators: passwordMatchValidator, asyncValidators: otherValidator});

  passwordMatchValidator(g: FormGroup) {
    return g.get("contrasenia").value === g.get("confirmContrasenia").value
      ? null
      : { mismatch: true };
  }

  //MOSTRAR ALERT INFORMACION
  showAlert() {
    let alert = this.alertCtrl.create({
      title: "NUEVO REGISTRO",
      subTitle: "Se ha realizado el registro de usuario correctamente.",
      buttons: ["Aceptar"]
    });
    alert.present();
  }

  //CERRAR MODAL RECUPERAR PASSWORD
  cerrarModalRegistro() {
    this.viewCtrl.dismiss();
  }

  //ABRIR MODAL DE FECHA: 2ºArg: parametros a pasar a modal, 3ºArgumento: animaciones personalizadas
  abrirModalFecha() {
    this.modalCtrl
      .create(
        "mi-elegir-fecha",
        {},
        {
          enterAnimation: "modal-fade-in-enter",
          leaveAnimation: "modal-fade-in-leave"
        }
      )
      .present();
  }

  //METODO REGISTRO USUARIO
  registrarUsuario(form: any) {
    console.log(this.usuario);
    this.cerrarModalRegistro();
    this.showAlert();
    let users = [];
    if (localStorage.getItem("LS_Usuarios")) {
      users = JSON.parse(localStorage.getItem("LS_Usuarios"));
    }
    //Añadiendo algunos campos a usuario
    this.usuario.tieneHuella = false;
    this.usuario.permiteHuella = false;
    this.usuario.id = this.fa.createGuid();
    users.push(this.usuario);
    localStorage.setItem("LS_Usuarios", JSON.stringify(users));
  }
}
