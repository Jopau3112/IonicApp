export interface Usuario {
  key?: string,
  nombre: string,
  apellidos: string,
  email: string,
  fechaNacimiento: string,
  user: string,
  password: string,
  confirmPassword?: string,
  permiteHuella?: boolean,
  tieneHuella?: boolean,
  tokenHuella?: string
}
