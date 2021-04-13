import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  value: any;
  private serverUrl="http://localhost:3000/api/users"

  constructor(private http: HttpClient,
    private route: ActivatedRoute) { 
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.value = params.id;
        }
      });
    }
    
  getListBoards(){
    return this.http.get(this.serverUrl + '/boards')
  }

  createNewBoard(boardName){
    return this.http.post(this.serverUrl + '/boards', {name : boardName})
  }

  deleteBoard(boardId) {
    return this.http.delete(this.serverUrl + '/boards/' + boardId)
  }
}