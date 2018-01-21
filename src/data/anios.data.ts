//Recoger año actual
let anioActual = new Date().getFullYear();
let anioInicial = 1905;
let aniosTranscurridos = anioActual - anioInicial + 1;

//Crear Arreglo de años
let aniosArray = [];
for (let index = 0; index < aniosTranscurridos; index++) {
  aniosArray.push(anioInicial + index);
}

export const ANIOS = aniosArray;
export const ANIO_INICIAL = anioInicial;
export const ANIO_ACTUAL = anioActual;
