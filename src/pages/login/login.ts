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

  passwordOculto = true;

  constructor(public navCtrl: NavController, private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  mostrarOcultarPassword(){
    if (this.passwordOculto) {
        document.getElementById("password").style.webkitTextSecurity = "none";
    } else {
        document.getElementById("password").style.webkitTextSecurity = "disc";
    }
    this.passwordOculto = !this.passwordOculto;
  }

  abrirModalRecuperar() {
    this.modalCtrl.create("mi-recuperar-password").present();
  }
  
  abrirModalRegistro() {
    this.modalCtrl.create("mi-regitro-usuario").present();
  }

  realizarLoginNormal() {
    console.log("Login Normal"); 
    //Servicio Login
    this.navCtrl.push("mi-menu-principal")
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

  


}
