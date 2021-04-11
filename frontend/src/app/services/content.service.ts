import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private serverUrl="http://localhost:3000"

  constructor(private http: HttpClient) { }

  get(){
    return this.http.get(this.serverUrl +'/protected')
  }

}
