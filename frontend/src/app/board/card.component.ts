import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BoardDragDropService } from '../services/board-dragdrop.service'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-card',
  template: `
  <form (keydown)="keyDownFunction($event)" [formGroup] = "cardForm">
    <input type="text" formControlName = 'card_name' class="card-new-input" placeHolder="Add New Card">
  </form>
  `,
  styles: [`
  .card-new-input{
    width: 250px;
    height: 30px;
    border: 0px;
    background-color: #ebecf0;
    cursor: pointer
  }`
  ]
})
export class CardComponent implements OnInit {
  cardForm: FormGroup;
  boardId: any;
  @Input() col_id;
  @Output() newCardEvent = new EventEmitter<Object>();
  constructor(
    private fb: FormBuilder,
    private boardDDService: BoardDragDropService,
    private activatedRoute: ActivatedRoute) {

    this.boardId = this.activatedRoute.snapshot.paramMap.get('id');
    this.cardForm = fb.group({
      'card_name': []
    })
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.boardDDService.addCard(this.boardId, this.col_id, {
        "title": this.cardForm.value.card_name
      }).subscribe(card => {
        this.newCardEvent.emit({ ...card, col_id: this.col_id })
        this.cardForm.get('card_name').setValue('')
      })
    }
  }

  ngOnInit(): void {
  }

}
