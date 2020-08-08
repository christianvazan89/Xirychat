import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Mensaje } from '../interface/mensaje.interface';

import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  public chat;
  public chats: Mensaje[] = [];
  public usuario: any = {};
  // tslint:disable-next-line: no-shadowed-variable
  constructor(private afs: AngularFirestore, public auth: AngularFireAuth) {
    this.auth.authState.subscribe(user => {
      console.log('Estado del usuario:', user);
      if( !user){
        return;
      }
      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    });
   }

    login(proveedor: string) {
      this.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }
    logout() {
      this.usuario = {};
      this.auth.signOut();
    }


  cargarMensajes(){
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(6));
    return this.itemsCollection.valueChanges().pipe(
                                map((mensajes: Mensaje[]) => {
                                  console.log(mensajes);
                                  this.chats = [];
                                  // tslint:disable-next-line: prefer-const
                                  for (let mensaje of mensajes){
                                    this.chats.unshift(mensaje);
                                  }
                                  return this.chats;
                                }));
  }

  agregarMensaje(texto: string){
    const mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    };
    return this.itemsCollection.add(mensaje);
  }
}
