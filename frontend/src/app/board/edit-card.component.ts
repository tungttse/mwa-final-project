import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import { BoardDragDropService } from '../services/board-dragdrop.service'

@Component({
  selector: 'edit-card',
  template: `
  <form [formGroup] = "edit_card" (ngSubmit)="onSubmit()">
    <lable>Card name:</label>
    <input type="text" name="name" formControlName = 'name'>
    <label>Description</label>
    <input type="text" name="description" formControlName = 'description'>
    <label>Label</label>
    <input type="text" name="label" formControlName = 'label'>
    <label>Deadline</label>
    <input type="date" name="deadline" formControlName = 'deadline'>
    <button type="submit">Save</button>
  </form>
  `,
  styles: [
  ]
})
export class EditCardComponent implements OnInit {
  edit_card : FormGroup;
  @Input() column_id;
  @Input() card_id;
  boardId : any;
  constructor(private fb : FormBuilder, 
    private activatedRoute: ActivatedRoute,
    private boardDDService: BoardDragDropService
    ) {
    this.boardId = this.activatedRoute.snapshot.paramMap.get('id');
    this.edit_card = this.fb.group({
      'name':[],
      'description': [],
      'label': [],
      'deadline': []
    })
  }

  onSubmit(){
    this.boardDDService.editCard();
  }

  ngOnInit(): void {
  }

}
