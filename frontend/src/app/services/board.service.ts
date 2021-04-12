import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class BoardService {
  value: any;
  private serverUrl="http://localhost:3000/api"

  constructor(private http: HttpClient,
    private route: ActivatedRoute) { 
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.value = params.id;
          console.log(this.value)
        }
      });
    }

  get(){
    return this.http.get(this.serverUrl +'/boards')
  }

  getById(id) {
    return this.http.get(this.serverUrl +'/boards/' + id)
  }

  getCardById(board_id, column_id, card_id) {
    return this.http.get(this.serverUrl +`/boards/cards/${board_id}/${column_id}/${card_id}` )
  }

  changeOrderColumn(boardId, body) {
    return this.http.patch(this.serverUrl +'/boards/order/columns/' + boardId, body)
  }

  changeOrderCard(boardId, body) {
    return this.http.patch(this.serverUrl +'/boards/order/cards/' + boardId, body)
  }

  addCardToColumn(board_id, column_id, card_data) {
    return this.http.post(this.serverUrl +`/boards/cards/${board_id}/${column_id}`, card_data )
  }
}