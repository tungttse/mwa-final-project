import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  // _token
  constructor() { }

  get token() {
    return localStorage.getItem('token')
    // return this._token;
  }

  set token(value) {
    localStorage.setItem('token', value)
    // this._token = value;
  }
}
