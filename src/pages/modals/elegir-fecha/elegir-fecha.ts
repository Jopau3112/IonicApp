import { RootScopeService } from "./../../../providers/root-scope/root-scope";
import { ANIOS, ANIO_INICIAL, ANIO_ACTUAL } from "./../../../data/anios.data";
import { MESES, MES_ACTUAL } from "../../../data/meses.data";
import { Component } from "@angular/core";
import { ObjetoFecha } from "../../../interfaces/objeto-fecha.interface";
import { FuncionesAuxiliares } from "../../../globals/functions.globals";
import {
  IonicPage,
  ViewController,
  NavController,
  NavParams
} from "ionic-angular";

@IonicPage({
  name: "mi-elegir-fecha"
})
@Component({
  selector: "page-elegir-fecha",
  templateUrl: "elegir-fecha.html"
})
export class ElegirFechaPage {
  meses: ObjetoFecha[] = MESES;
  anios: number[] = ANIOS;
  dias: any[] = [];
  mesElegido: number;
  anioElegido: number;
  diaElegido: string;
  minimaMesAnio: boolean = false;
  maximaMesAnio: boolean = true;
  fechaElegida: string = "";

  fa = new FuncionesAuxiliares();
  hoy: string = this.fa.devolverFechaActual();

  constructor(
    private viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private _rss: RootScopeService
  ) {
    console.log(this.meses);
    console.log(this.anios);
    //Recogemos mes y anio actual y seleccionamos por defecto
    this.mesElegido = MES_ACTUAL;
    this.anioElegido = ANIO_ACTUAL;

    this.mostrarCalendario(MES_ACTUAL, ANIO_ACTUAL);
    // this.diaElegido = this.hoy;
    console.log(this.diaElegido);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ElegirFechaPage");
  }

  //CERRAR MODAL FECHA
  cerrarModalFecha() {
    this.viewCtrl.dismiss();
  }

  //ELEGIR MES AÑO DEL SELECT
  elegirMesAnio() {
    if (this.anioElegido == ANIO_ACTUAL && this.mesElegido >= MES_ACTUAL) {
      this.maximaMesAnio = true;
    } else {
      this.maximaMesAnio = false;
    }
    if (this.anioElegido == ANIO_INICIAL && this.mesElegido == 1) {
      this.minimaMesAnio = true;
    } else {
      this.minimaMesAnio = false;
    }
    this.mostrarCalendario(this.mesElegido, this.anioElegido);
  }

  //IR A MES ANTERIOR (SI PROCEDE)
  irAnteriorMes() {
    if (!this.minimaMesAnio) {
      if (this.mesElegido == 1) {
        this.mesElegido = 12;
        this.anioElegido = this.anioElegido - 1;
      } else {
        this.mesElegido = this.mesElegido - 1;
      }
      this.elegirMesAnio();
    } else {
      console.log("No retroceder mes");
    }
  }

  //IR A MES PROXIMO (SI PROCEDE)
  irProximoMes() {
    if (!this.maximaMesAnio) {
      if (this.mesElegido == 12) {
        this.mesElegido = 1;
        this.anioElegido++;
      } else {
        this.mesElegido++;
      }
      this.elegirMesAnio();
    } else {
      console.log("No avanzar mes");
    }
  }

  //MOSTRAR DIAS DE ACUERDO A MES Y AÑO
  mostrarCalendario(mes, anio) {
    console.log("/" + mes + "/" + anio);
    this.dias = this.fa.devolverDiasCompleto(mes, anio);
  }

  //ELECCION DE DIA EN EL CALENDARIO
  elegirDiaCalendario(id) {
    if (this.esDiaHabilitado(id)) {
      this.diaElegido = id;
      console.log(this.diaElegido);
    } else {
      console.log("dia futuro");
    }
  }

  //VERIFICAR SI ES DIA FUTURO O NO
  esDiaHabilitado(id) {
    let eleccion = id.split("-");
    let now = this.hoy.split("-");
    if (
      eleccion[2] > now[2] ||
      (eleccion[2] == now[2] && eleccion[1] > now[1]) ||
      (eleccion[2] == now[2] && eleccion[1] == now[1] && eleccion[0] > now[0])
    ) {
      return false;
    } else {
      return true;
    }
  }

  //BOTON ELEGIR FECHA
  elegirFecha() {
    console.log(this.diaElegido);
    this.fechaElegida = this.diaElegido;
    this.cerrarModalFecha();
    // Actualizando valor de la fecha de nacimiento del usuario usando el servicio
    this._rss.setData(this.fechaElegida);
  }
}
