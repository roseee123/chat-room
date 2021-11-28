import { Message } from './../interface/message';
import { SocketService } from './../service/socket.service';
import { Component, OnInit } from '@angular/core';
import { UserComponent } from '../user/user.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  connection: any;
  name: string = '';
  messageContent: string = '';
  message: Message = {
    User: '',
    Content: '',
    SendTime: ''
  };
  dialogRef!: MatDialogRef<UserComponent> | null;

  constructor(
    private socketService: SocketService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.openDialog();

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UserComponent, {
      width: '250px',
      data: this.name
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.name = result;
    });

    this.connection = this.socketService.getMessage()
    .subscribe((message: Message) => {
      this.messages.push(message);
    });

    this.socketService.connect()
      .subscribe(() => {
        console.log('connected');
      });

      this.socketService.disconnect()
      .subscribe(() => {
        console.log('disconnected');
      });
  }



  sendMessage(message: string): void {
    const date = new Date();
    this.message.User = this.name;
    this.message.Content = this.messageContent;
    this.message.SendTime = date.toISOString();
    this.socketService.sendMessage(this.message);
    this.messageContent = '';
  }
}
