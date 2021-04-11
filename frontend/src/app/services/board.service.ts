import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private serverUrl="http://localhost:3000/api"

  constructor(private http: HttpClient) { }

  get(){
    return this.http.get(this.serverUrl +'/boards')
  }

}
