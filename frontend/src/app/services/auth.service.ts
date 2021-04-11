import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private serverUrl="http://localhost:3000/api/auth"

  constructor(private http: HttpClient) { }

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
