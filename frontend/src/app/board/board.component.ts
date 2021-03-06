import { Component, OnInit } from '@angular/core';
import { BoardService } from '../services/board.service'
import { DataSharingService } from '../services/data-sharing-service.service';

import { UserService } from '../services/user.service'

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import * as _ from 'underscore';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-protected',
  templateUrl: 'board.component.html',
  styleUrls: ['board.component.css']
})
export class BoardComponent implements OnInit {
  content: String = ""
  timeHandler: any
  loadingTimeOut: any
  boards: any = []
  constructor(
    private userService: UserService,
    private boardService: BoardService,
    private dataSharingService: DataSharingService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
     ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.userService.getListBoards().subscribe(
      res => {
        if(res['error']) {
          this.content = "Error " + res['error']
        }
        this.content = res['data']
        this.boards = res['boards']
        this.loadingTimeOut = setTimeout(()=> {
          this.spinner.hide();
        }, 500)
      }
    )
  }

  createNewBoard(event) {
    if(event.target.value === "" || event.target.value === null) {
      return false
    }

    this.userService.createNewBoard(event.target.value)
    .subscribe(res => {
      if(this.boards) {
        this.boards.push(res)
      } else {
        this.boards = [res]
      }
      event.target.value = ""
    })
  }

  onDelete(board) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Remove Board',
        message: 'Are you sure you want to remove this board: ' + board.name
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.userService.deleteBoard(board._id).subscribe(re => {
          this.boards = _.without(this.boards, _.findWhere(this.boards, {
            _id: board._id
          }));

          this.dataSharingService.userDeletedBoard.next(true);
        })
      }
    });
  }

  onEdit(board) {
    board.isEdited = true
    this.timeHandler = setTimeout(() => {
      board.isEdited = false
    }, 10000)
  }

  editBoardName(event, board) {
    let newName = event.target.value
    if(newName === "" || newName === null) {
      board.isEdited = false;
      return false
    }
    if(newName === board.name) {
      board.isEdited = false;
      return false
    }
    let boardId = board._id
    this.boardService.editBoard(boardId, newName).
      subscribe(re => {
        board.isEdited = false;
        board.name = newName
      })
  }

  ngOnDestroy() {
    clearTimeout(this.timeHandler)
    clearTimeout(this.loadingTimeOut)
  }
}