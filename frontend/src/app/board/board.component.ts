import { Component, OnInit } from '@angular/core';
import { BoardService } from '../services/board.service'
import { DataSharingService } from '../services/data-sharing-service.service';

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
    private userService: UserService,
    private dataSharingService: DataSharingService
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
    this.userService.createNewBoard(event.target.value)
    .subscribe(res => {
      this.dataSharingService.userCreatedNewBoard.next(this.boards.push(res));
      event.target.value = ""
    })
  }

  onDelete(board) {
    console.log(board);

  }

  onEdit(board) {
    console.log(board);

  }
}