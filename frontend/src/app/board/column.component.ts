import { Component, Input, OnInit } from '@angular/core';
import { BoardService } from '../services/board.service'

@Component({
  selector: 'board-column',
  templateUrl: 'column.component.html',
  styleUrls: ['column.component.css']
})
export class ColumnComponent implements OnInit {
  @Input() name
  constructor(private boardService: BoardService ) { }

  ngOnInit(): void {
   
  }
}
