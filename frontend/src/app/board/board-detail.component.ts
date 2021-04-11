import { Component, OnInit } from '@angular/core';
import { BoardService } from '../services/board.service'
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'board-detail',
  templateUrl: 'board-detail.component.html',
  styleUrls: ['board-detail.component.css']
})
export class BoardDetailComponent implements OnInit {
  //TODO: add spiner state
  content: String = "fetching..."

  //TODO
  columns = [
    'Todo',
    'Doing',
    'Verifying',
    'Done',
    'Ideas'
  ];

  constructor(private boardService: BoardService ) { }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  ngOnInit(): void {
    this.boardService.get().subscribe(
      res => {
        if(res['error']) {
          this.content = "Error " + res['error']
        }
        this.content = res['data']
      }
    )
  }
}
