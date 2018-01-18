import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';

@IonicPage({
  name: "mi-login"
})

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {

  usuario: any = {
    username: "",
    password: ""
  }

  constructor(public navCtrl: NavController, private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  realizarLogin() {
    alert("asdadas");
    // console.log("Realizando login...");
    // console.log(this.usuario);
    // //Servicio Login
    // this.navCtrl.push("mi-menu-principal")
  }

  abrirModalRecuperar() {
    this.modalCtrl.create("mi-recuperar-password").present();
  }


}
