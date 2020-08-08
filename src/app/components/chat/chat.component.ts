import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../providers/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [
  ]
})
export class ChatComponent implements OnInit {
mensaje = '';
elemento: any;
  constructor(public cs: ChatService) {
    this.cs.cargarMensajes()
    .subscribe( () => {
      this.elemento.scrollTop = this.elemento.scrollHeight;
    });
  }

ngOnInit(){
  this.elemento = document.getElementById('app-mensajes');
}

  enviar_mensaje(){
    console.log(this.mensaje);
    if (this.mensaje.length === 0){
      return;
    }
    this.cs.agregarMensaje(this.mensaje);
    this.mensaje = ''; // para borrar mensaje enviar mensaje
  }
}
