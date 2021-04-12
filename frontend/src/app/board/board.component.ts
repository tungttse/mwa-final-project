import { Component, OnInit } from '@angular/core';
import { BoardService } from '../services/board.service'

import { UserService } from '../services/user.service'

@Component({
  selector: 'app-protected',
  template: `
  <div>
    <div class="container content-area">
        <br>
        <br>
        <div class="container content-grid">
        <mat-grid-list cols="3" rowHeight="2:3">
          <div *ngFor="let board of boards">
            <mat-grid-tile><a routerLink='/boards/{{board._id}}'>{{board.name}}</a></mat-grid-tile>
          </div>
        </mat-grid-list>

        </div>
    </div>
</div>
`,
  styles: [`
  mat-grid-tile {
    background: lightblue;
    border : 1px solid rebeccapurple;
    background-color: aquamarine;
    cursor: pointer;
    margin: 5px;
  }
  
  .content-grid {
      
  }

  .content-area{
    margin: 0 auto;
    max-width: 650px;
  }
  `]
})
export class BoardComponent implements OnInit {
  content: String = "fetching..."
  boards: any
  constructor(private userService: UserService ) { }

  ngOnInit(): void {
    this.userService.getListBoards().subscribe(
      res => {
        console.log(res)
        if(res['error']) {
          this.content = "Error " + res['error']
        }
        this.content = res['data']
        this.boards = res['boards']
      }
    )
  }
}