import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private serverUrl="http://localhost:3000/api/auth"
  
  // Observable string sources
  private user = new Subject<string>();
  // Observable string streams
  user$ = this.user.asObservable();
  
  constructor(private http: HttpClient) {
  }

  emitEventUser(value){
    this.user.next(value.fname);
  }

  get userInfo() {
    return localStorage.getItem('currentUser');
  }

  set userInfo(value) {
    this.user.next(value);
    localStorage.setItem('currentUser', JSON.stringify(value));
  }

  logout() {
    localStorage.setItem('currentUser', '');
    localStorage.setItem('token', '');
    this.user.next("");
  }

  doPostLogin(data){
    return this.http.post(this.serverUrl +'/login', data)
  }

  doPostSignup(data){
    return this.http.post(this.serverUrl +'/signup', data)
  }

  doValidateEmail(data) {
    return this.http.post(this.serverUrl +'/checkemail', data)
  }
}
