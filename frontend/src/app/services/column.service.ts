import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ColumnService {

  private serverUrl="http://localhost:3000/api/columns"

  constructor(private http: HttpClient) { }
 
  addNewColumn(board_id, column_name) {
    return this.http.post(this.serverUrl +`/${board_id}`, {name: column_name})
  }

  updateColumnName(column_id, board_id, column_name) {
    return this.http.patch(this.serverUrl + `/${column_id}/${board_id}`,column_name)
  }

  deleteColumn(column_id, board_id) {
    return this.http.delete(this.serverUrl + `/${column_id}/${board_id}`)
  }
  
}
