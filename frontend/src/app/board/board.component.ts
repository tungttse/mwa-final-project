import { Component, OnInit } from '@angular/core';
import { BoardService } from '../services/board.service'
import { DataSharingService } from '../services/data-sharing-service.service';

import { UserService } from '../services/user.service'

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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
    private dataSharingService: DataSharingService,
    private dialog: MatDialog
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

    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Remove Board',
        message: 'Are you sure, you want to remove this board: ' + board.name
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      console.log(result)
      if (result === true) {
        
      
      }
    });


  }

  onEdit(board) {
    console.log(board);

  }
}