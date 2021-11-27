import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Message } from '../interface/message'

const SERVER_URL = 'http://localhost:8080';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(SERVER_URL);
  }

  public sendMessage(message: any): void {
    this.socket.emit('sendMessage', message);
  }

  public getMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    })

  }
}
