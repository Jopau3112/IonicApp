import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Usuario} from "../../interfaces/usuario.interface";

@Injectable()
export class UsuariosService {
  usuarios: Usuario[] = [];
  private headers = new HttpHeaders({
    'Authorization': 'application/json',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  });

  constructor(private http: HttpClient, private afDB: AngularFireDatabase) {
    //CARGAR USUARIOS BBDD
    //CON FIREDATABASE
    this.afDB.list('/usuarios').snapshotChanges().map(actions => {
      return actions.map(action => ({key: action.key, ...action.payload.val()}));
    }).subscribe(items => {
      items.map(item => item.key);
      console.log(items);
    });

    //CON HTTP
    this.http.get('https://ionicappjoel.firebaseio.com/usuarios.json')
      .subscribe((data) => {
        for (let key$ in data) {
          let user: Usuario = data[key$];
          user.key = key$;
          this.usuarios.push(user);
        }
        console.log(this.usuarios);
      }, error => {
        console.log("Error occured");
      })

    //Ejemplo
    // http.get('http://jsonplaceholder.typicode.com/users/')
    //   .flatMap((response) => response.json())
    //   .filter((person) => person.id > 5)
    //   .map((person) => "Dr. " + person.name)
    //   .subscribe((data) => {
    //     this.doctors.push(data);
    //   });
  }

  getUsuarios() {
    return this.usuarios;
  }

  addUsuario(user) {
    let key = user.key;
    delete user.key;
    //PARA ENVIAR CON KEY PERSONALIZADA HAY QUE HACER UPDATE

    // //CON FIREDATABASE
    // const afList = this.afDB.list('/usuarios');
    // //afList.push(user);     Push con key por defecto

    // //Push con key forma guid
    // this.afDB.object(`/usuarios/${key}`).update(user);
    // const listObservable = afList.snapshotChanges();
    // listObservable.subscribe(res => {
    //     console.log(res);
    //   },
    //   err => {
    //     console.log("Error occured");
    //   });

    //CON HTTP
    //this.http.post(`https://ionicappjoel.firebaseio.com/usuarios.json`, JSON.stringify(user), {headers: this.headers});
    //con key forma guid
    return this.http.put(`https://ionicappjoel.firebaseio.com/usuarios/${key}.json`, user,
      {headers: this.headers});
  }

}
