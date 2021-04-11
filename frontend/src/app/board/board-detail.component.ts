import { Component, OnInit } from '@angular/core';
import { BoardService } from '../services/board.service'
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { DragulaService } from "ng2-dragula";

@Component({
  selector: 'board-detail',
  templateUrl: 'board-detail.component.html',
  styleUrls: ['board-detail.component.css']
})
export class BoardDetailComponent implements OnInit {
  //TODO: add spiner state
  content: String = "fetching..."

  //TODO: hardcode
  public columns:Array<any> = [
    {
      name: 'Todo',
      cards: [{name: 'Item A'}, {name: 'Item B'}, {name: 'Item C'}, {name: 'Item D'}]
    },
    {
      name: 'Doing',
      cards: [{name: 'Item 1'}, {name: 'Item 2'}, {name: 'Item 3'}, {name: 'Item 4'}]
    },

    {
      name: 'Verifying',
      cards: [{name: 'Item 1'}, {name: 'Item 2'}, {name: 'Item 3'}, {name: 'Item 4'}]
    },

    {
      name: 'Done',
      cards: [{name: 'Item 1'}]
    },
  ];

  constructor(
    private boardService: BoardService,
    private dragulaService: DragulaService
     ) {

      this.dragulaService.createGroup("COLUMNS", {
        direction: 'horizontal',
        moves: (el, source, handle) => {
          console.log(el, source)
          return handle.className === "group-handle"
        }
      });

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
