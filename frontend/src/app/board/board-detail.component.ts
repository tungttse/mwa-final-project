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
        // console.log("drop catch all ", el ,target, sibling)
        if(el.getAttribute("id") == null) {
          return false
        }
      
        let targetColumnId = target.getAttribute('id')
        console.log(target.childNodes)
        console.log(targetColumnId)
        // know add card and re - order all cards.

        // know delete card from
        //TODO: now can delete old card out of column
        let oldCardOrder = el.getAttribute("order")
        let movedCardId = el.getAttribute("id")
        let sourceColumnId = el.getAttribute("data-colid")  
        console.log(oldCardOrder, movedCardId, sourceColumnId)
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

  ngOnInit(): void {
    this.boardService.getById(this.boardId).subscribe(
      res => {
        if (!res ||res['error'] || res["_id"] == null || typeof res["_id"] === "undefined") {
          this.content = "Error " + res['error']
          console.log('Error')
        } else {
          this.content = res
          this.columns = _.sortBy(res['columns'], "order")
        }
      }
    )
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
