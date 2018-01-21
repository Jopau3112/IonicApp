export class FuncionesAuxiliares {
  constructor() {}

  funcionGlobal() {
    console.log("funcion cargada correctamente");
  }

  createGuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16).toLowerCase();
    });
  }

  formatoElementoFecha(elemento) {
    if (elemento < 10) {
      return "0" + elemento;
    }
    return elemento;
  }

  devolverFechaActual() {
    let hoy = new Date();
    return (
      this.formatoElementoFecha(hoy.getDate()) +
      "-" +
      this.formatoElementoFecha(hoy.getMonth() + 1) +
      "-" +
      hoy.getFullYear()
    );
  }

  devolverArrregloDias(mes, anio) {
    let dias = [];
    let numeroDias = new Date(anio, mes, 0).getDate();
    for (let index = 1; index <= numeroDias; index++) {
      dias.push(index);
    }
    return dias;
  }

  devolverDiasCompleto(mes, anio) {
    let diasArreglo = [];
    let diasCompleto = [];
    let dias = this.devolverArrregloDias(mes, anio);
    let fecha = new Date(anio, mes - 1, 1);
    let diaNumber = fecha.getDay();
    //Cambiar el indice de domingo de 0 a 7
    if (diaNumber == 0) {
      diaNumber = 7;
    }
    let cerosInicio = diaNumber - 1;
    let cerosFinal = 0;

    //Rellenar ceros al inicio que no se mostraran
    for (let index = 1; index <= cerosInicio; index++) {
      diasCompleto.push(0);
    }
    diasCompleto = diasCompleto.concat(dias);

    //Rellenar ceros al final que no se mostraran
    if (diasCompleto.length % 7 != 0) {
      cerosFinal =
        7 * (Math.floor(diasCompleto.length / 7) + 1) - diasCompleto.length;
    }
    for (let index = 1; index <= cerosFinal; index++) {
      diasCompleto.push(0);
    }

    //Agrupar dias en arreglos de 7
    let numeroFilas = Math.floor(diasCompleto.length / 7);
    for (let i = 0; i < numeroFilas; i++) {
      let fila = [];
      for (let j = 0; j < 7; j++) {
        let formato =
          this.formatoElementoFecha(diasCompleto[7 * i + j]) +
          "-" +
          this.formatoElementoFecha(mes) +
          "-" +
          anio;
        let objeto = {
          id: formato,
          numero: diasCompleto[7 * i + j]
        };
        fila.push(objeto);
      }
      diasArreglo.push(fila);
    }
    console.log(diasArreglo);
    return diasArreglo;
  }

  // esUsuarioAplicacion(usuario, usuarios) {
  //   let estaRegistrado: boolean = false;
  //   usuarios.forEach(element => {
  //     if (
  //       usuario.username == element.user &&
  //       usuario.password == element.password
  //     ) {
  //       estaRegistrado = true;
  //     }
  //   });
  //   return estaRegistrado;
  // }

  devolverUsuarioAplicacion(usuario, usuarios) {
    let user: any = null;
    usuarios.forEach(element => {
      if (
        usuario.username.toLowerCase() == element.user.toLowerCase() &&
        usuario.password == element.password
      ) {
        user = element;
      }
    });
    return user;
  }

  actualizarUsuario(usuario) {
    let usuarios = JSON.parse(localStorage.getItem("LS_Usuarios"));
    let usuariosActualizado = [];
    usuarios.forEach(element => {
      if (usuario.id == element.id) {
        usuariosActualizado.push(usuario);
      } else {
        usuariosActualizado.push(element);
      }
    });
    localStorage.setItem("LS_Usuarios", JSON.stringify(usuariosActualizado));
  }
}
