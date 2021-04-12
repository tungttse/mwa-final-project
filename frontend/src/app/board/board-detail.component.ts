import { Component, OnInit } from '@angular/core';
import { BoardDragDropService } from '../services/board-dragdrop.service'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragulaService } from "ng2-dragula";
import { from, Subscription } from "rxjs";
import {Router, ActivatedRoute, Params} from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'board-detail',
  templateUrl: 'board-detail.component.html',
  styleUrls: ['board-detail.component.css']
})
export class BoardDetailComponent implements OnInit {
  //TODO: add spiner state

  content: any
  isEdited = false;
  inputAdded = false;

  public columns: Array<any> = [];

  boardId: any


  subs = new Subscription();
  constructor(
    private boardDDService: BoardDragDropService,
    private dragulaService: DragulaService,
    private activatedRoute: ActivatedRoute
  ) {
    this.boardId = this.activatedRoute.snapshot.paramMap.get('id');
    try{
      this.dragulaService.createGroup("COLUMNS", {
        direction: 'horizontal',
        moves: (el, source, handle) => {
          return handle.className === "group-handle"
        }
      });
    } catch(e){}
    
 
    this.subs.add(this.dragulaService.drop()
      .subscribe(({ name, el, target, source, sibling }) => {
        console.log("drop catch all ", el ,target, sibling)
        if(el.getAttribute("id") == null) {
          return false
        }
      
        let targetColumnId = target.getAttribute('id')
        let childNodes = target.children
        
       
        let oldCardOrder = el.getAttribute("order")
        let movedCardId = el.getAttribute("id")
        let sourceColumnId = el.getAttribute("data-colid")  
    
        if(targetColumnId === sourceColumnId) {
          // change order of cards in a column
          for (let index = 0; index < childNodes.length; index++) {
            const element = childNodes[index];
            if(element.getAttribute('id')) {
              let body = {
                "column_id" : targetColumnId,
                "new_order" : index + 1,
                "card_id" : element.getAttribute('id')
              }
  
              this.boardDDService.changeOrderCard(this.boardId, body)
              .subscribe(re => console.log(re))
            } else {
              console.log('leuleu')
            }
          }

          // targetColumnId
          // boardid
          // 
        } else {
         
          // getinfo old card
          this.boardDDService.getCardById(this.boardId, sourceColumnId, movedCardId).subscribe(cr => {
            if(cr['columns']) {
              let foundedcol = _.filter(cr['columns'], col => {
                return col._id == sourceColumnId
              })

              let card = _.filter(foundedcol[0].cards, cinfo => {
                return cinfo._id == movedCardId
              })

              /**
               * found moving card
               * add to new column
               * update order of cards in column
               * delete old card at old column
              */
              this.boardDDService.addCardToColumn(this.boardId, targetColumnId, card[0]).subscribe(ars => {
                if(ars) {
                  this._updateOrderCard(targetColumnId, childNodes)
                  this.boardDDService.deleteCardOutOfColumn(this.boardId, sourceColumnId, movedCardId).subscribe(dres => console.log(dres))
                }

                // delete old card
              })
            }
          })
        }
      })
    );

     this.subs.add(this.dragulaService.dropModel("COLUMNS")
      .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
       for (let index = 0; index < targetModel.length; index++) {
         const element = targetModel[index];
         let body = {
           "column_id" : element._id,
           "new_order" : index + 1
         }
         this.boardDDService.changeOrderColumn(this.boardId, body)
         .subscribe(re => console.log(re))
       }
      })
    );
    
  }

  _updateOrderCard(targetColumnId, childNodes){
    for (let index = 0; index < childNodes.length; index++) {
      const element = childNodes[index];
      let body = {
        "column_id" : targetColumnId,
        "new_order" : index + 1,
        "card_id" : element.getAttribute('id')
      }

      this.boardDDService.changeOrderCard(this.boardId, body)
      .subscribe(re => console.log(re))
    }
  }

  ngOnInit(): void {
    this.boardDDService.getById(this.boardId).subscribe(
      res => {
        if (!res ||res['error'] || res["_id"] == null || typeof res["_id"] === "undefined") {
          this.content = "Error " + res['error']
        } else {
          this.content = res
          res['columns'].forEach(element => {
            element.cards = _.sortBy(element.cards, "order")
          });
          this.columns = _.sortBy(res['columns'], "order")
        }
      }
    )
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  edited() {
    this.isEdited = true;
  }

  apply(content) {
    this.columns[0].name = content;
    this.inputAdded = true;
  }

}
