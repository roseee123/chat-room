import { Message } from './../interface/message';
import { User } from './../interface/user';
import { SocketService } from './../service/socket.service';
import { Component, OnInit } from '@angular/core';
import { UserComponent } from '../user/user.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  public messages: Message[] = [];
  private connection: any;
  public name: string = '';
  public messageContent: string = '';
  private message: Message = {
    User: '',
    Content: '',
    SendTime: ''
  };
  public dialogRef!: MatDialogRef<UserComponent> | null;
  public users: User[] = [];

  constructor(
    private socketService: SocketService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.openDialog();

  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(UserComponent, {
      width: '250px',
      data: ''
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(`Dialog result: ${result}`);
        this.name = result;

        this.socketService.connect(this.name)
          .subscribe(() => {
            console.log('connected');
          });

        this.connection = this.socketService.getMessage()
          .subscribe((message: Message) => {
            console.log('eee');
            this.messages.push(message);
          });

        this.socketService.disconnect()
          .subscribe(() => {
            console.log('disconnected');
          });

        this.socketService.getUserList()
          .subscribe((user: User[]) => {
            this.users = user;
          });
      }
    });
  }

  public sendMessage(message: string): void {
    const date = new Date();
    this.message.User = this.name;
    this.message.Content = this.messageContent;
    this.message.SendTime = date.toISOString();
    this.socketService.sendMessage(this.message);
    this.messageContent = '';
  }
}
