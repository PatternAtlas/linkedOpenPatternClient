import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  constructor() { }

  public isLoggedIn(): boolean {

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return token !== null && username !== null;
  }


}
