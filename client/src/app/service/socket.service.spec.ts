import { TestBed } from '@angular/core/testing';

import { SocketService } from './socket.service';

describe('SocketService', () => {
  let service: SocketService;
  let socket;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
