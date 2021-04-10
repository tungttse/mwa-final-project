import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  _token
  constructor() { }

  get token() {
    return this._token;
  }

  set token(value) {
    this._token = value;
  }
}
