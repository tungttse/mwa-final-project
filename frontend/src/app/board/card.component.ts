import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BoardDragDropService } from '../services/board-dragdrop.service'
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-card',
  template: `
  <form (keydown)="keyDownFunction($event)" [formGroup] = "cards_form">
    <input type="text" formControlName = 'card_name'>
  </form>
  `,
  styles: [
  ]
})
export class CardComponent implements OnInit {
  cards_form: FormGroup;
  boardId : any;
  @Input() col_id;
  constructor(
    private fb: FormBuilder, 
    private boardDDService: BoardDragDropService, 
    private activatedRoute: ActivatedRoute) {

    this.boardId = this.activatedRoute.snapshot.paramMap.get('id');
    this.cards_form = fb.group({
      'card_name': []
    })
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      console.log(JSON.stringify(this.cards_form.value.card_name) + "\n" + this.boardId, + "\n" + this.col_id);
      this.boardDDService.addCard(this.boardId, this.col_id,{"title" : this.cards_form.value.card_name}).subscribe(ars => {console.log(ars)})
    }
  }

  ngOnInit(): void {
  }

}
