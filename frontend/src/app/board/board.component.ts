import { Component, OnInit } from '@angular/core';
import { BoardService } from '../services/board.service'

import { UserService } from '../services/user.service'

@Component({
  selector: 'app-protected',
  templateUrl: 'board.component.html',
  styleUrls: ['board.component.css']
})
export class BoardComponent implements OnInit {
  content: String = "fetching..."
  boards: any
  constructor(
    private userService: UserService
     ) { }

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

  createNewBoard(event) {
    console.log('new boad', event.target.value)

    this.userService.createNewBoard(event.target.value)
    .subscribe()


  }
}