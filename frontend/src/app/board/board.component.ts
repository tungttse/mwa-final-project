import { Component, OnInit } from '@angular/core';
import { BoardService } from '../services/board.service'

@Component({
  selector: 'app-protected',
  templateUrl: 'board.component.html',
  styles: [
  ]
})
export class BoardComponent implements OnInit {
  content: String = "fetching..."
  constructor(private boardService: BoardService ) { }

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
