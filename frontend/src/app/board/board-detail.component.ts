import { Component, OnInit } from '@angular/core';
import { BoardService } from '../services/board.service'
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
  content: any = "fetching..."

  public columns: Array<any> = [];

  boardId: any


  subs = new Subscription();
  constructor(
    private boardService: BoardService,
    private dragulaService: DragulaService,
    private activatedRoute: ActivatedRoute
  ) {
    this.boardId = this.activatedRoute.snapshot.paramMap.get('id');
    
    this.dragulaService.createGroup("COLUMNS", {
      direction: 'horizontal',
      moves: (el, source, handle) => {
        return handle.className === "group-handle"
      }
    });
 
    this.subs.add(this.dragulaService.drop()
      .subscribe(({ name, el, target, source, sibling }) => {
        console.log("drop catch all ", el ,target, sibling)
        if(el.getAttribute("id") == null) {
          return false
        }
      
        let targetColumnId = target.getAttribute('id')
        let childNodes = target.children
        console.log("target.childNodes ",target.childNodes)
       
        // know delete card from
        //TODO: now can delete old card out of column
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
  
              this.boardService.changeOrderCard(this.boardId, body)
              .subscribe(re => console.log(re))
            } else {
              console.log('leuleu')
            }
          }

          // targetColumnId
          // boardid
          // 
        } else {
          // move card to other column
          console.log('# column')
          // getinfo old card
          this.boardService.getCardById(this.boardId, sourceColumnId, movedCardId).subscribe(cr => {
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
              this.boardService.addCardToColumn(this.boardId, targetColumnId, card[0]).subscribe(ars => {
                // this._updateOrderCard(targetColumnId, childNodes)
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
         this.boardService.changeOrderColumn(this.boardId, body)
         .subscribe(re => console.log(re))
       }
      })
    );
    
    // this.subs.add(this.dragulaService.removeModel("COLUMNS")
    //   .subscribe(({ el, source, item, sourceModel }) => {
    //     console.log("removeModel", el, source, item, sourceModel);
    //   })
    // );

    // this.subs.add(this.dragulaService.drag("COLUMNS")
    //   .subscribe(({ name, el, source }) => {
    //     console.log("drag ", name, el, source)
    //   })
    // );

    // this.subs.add(this.dragulaService.drop("COLUMNS")
    //   .subscribe(({ name, el, target, source, sibling }) => {
    //     console.log("drop ", name, el,target,  source, sibling)
    //   })
    // );
  }

  _updateOrderCard(targetColumnId, childNodes){
    for (let index = 0; index < childNodes.length; index++) {
      const element = childNodes[index];
      let body = {
        "column_id" : targetColumnId,
        "new_order" : index + 1,
        "card_id" : element.getAttribute('id')
      }

      this.boardService.changeOrderCard(this.boardId, body)
      .subscribe(re => console.log(re))
    }
  }

  ngOnInit(): void {
    this.boardService.getById(this.boardId).subscribe(
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
}
