import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class BoardService {
  value: any;
  private serverUrl="http://localhost:3000/api/boards"

  constructor(private http: HttpClient,
    private route: ActivatedRoute) { 
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.value = params.id;
        }
      });
    }
}