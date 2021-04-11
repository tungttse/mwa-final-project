import { Component, OnInit } from '@angular/core';
import { BoardService } from '../services/board.service'
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'board-detail',
  templateUrl: 'board-detail.component.html',
  styleUrls: ['board-detail.component.css']
})
export class BoardDetailComponent implements OnInit {
  content: String = "fetching..."

   timePeriods = [
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century'
  ];

  constructor(private boardService: BoardService ) { }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
  }

  ngOnInit(): void {
    this.boardService.get().subscribe(
      res => {
        console.log(res)
        if(res['error']) {
          this.content = "Error " + res['error']
        }
        this.content = res['data']
      }
    )
  }
}
