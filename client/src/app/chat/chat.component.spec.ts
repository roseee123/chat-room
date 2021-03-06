import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { ChatComponent } from './chat.component';
import { SocketService } from './../service/socket.service';
import { User } from './../interface/user';
import { Message } from './../interface/message';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let MockSocketService = jasmine.createSpyObj('RealSocketService', ['connect', 'disconnect', 'sendMessage', 'getMessage', 'getUserList']);
  let dialogSpy: jasmine.Spy;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of('Rosa') });
  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: SocketService, useValue: MockSocketService }],
      imports: [
        MatDialogModule,
        BrowserAnimationsModule],
      declarations: [ChatComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call openDialog', () => {
    const fixture = TestBed.createComponent(ChatComponent);
    const component = fixture.componentInstance;
    let name: string = '';
    component.openDialog();
    expect(dialogSpy).toHaveBeenCalled();
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
    dialogRefSpyObj.afterClosed().subscribe((result: any) => {
      name = result;
      expect(name).toEqual('Rosa');
      expect(MockSocketService.connect).toHaveBeenCalled();
      MockSocketService.connect(name).subscribe(() => {
        expect(MockSocketService.getMessage).toHaveBeenCalled();
        expect(MockSocketService.disconnect).toHaveBeenCalled();
        expect(MockSocketService.getUserList).toHaveBeenCalled();
      })
    });
  })

  it('should call sendMessage', () => {
    const fixture = TestBed.createComponent(ChatComponent);
    const component = fixture.componentInstance;
    component.sendMessage();
    expect(MockSocketService.sendMessage).toHaveBeenCalled();
  })
});
