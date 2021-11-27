import { SocketService } from './../service/socket.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: string[] = [];
  connection: any;
  message: string='';

  constructor(private socketService:SocketService) { }

  ngOnInit(): void {
    this.connection = this.socketService.getMessage()
    .subscribe(message => {
      this.messages.push(message);
    });
  }

  sendMessage() {
    this.socketService.sendMessage(this.message);
    this.message = '';
  }

}
