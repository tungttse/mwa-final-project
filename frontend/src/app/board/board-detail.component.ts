import { Component, OnInit } from '@angular/core';
import { BoardDragDropService } from '../services/board-dragdrop.service'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragulaService } from "ng2-dragula";
import { from, Subscription } from "rxjs";
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as _ from 'underscore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColumnService } from '../services/column.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

import { DataSharingService } from '../services/data-sharing-service.service';


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
    private activatedRoute: ActivatedRoute,
    private dataSharingService: DataSharingService,
    public dialog: MatDialog,
    private columnService: ColumnService
  ) {
    this.boardId = this.activatedRoute.snapshot.paramMap.get('id');
    try {
      this.dragulaService.createGroup("COLUMNS", {
        direction: 'horizontal',
        moves: (el, source, handle) => {
          return handle.className === "group-handle"
        }
      });
    } catch (e) { }

    this.subs.add(this.dragulaService.drop()
      .subscribe(({ name, el, target, source, sibling }) => {
        if (el.getAttribute("id") == null) {
          return false
        }

        let targetColumnId = target.getAttribute('id')
        let childNodes = target.children
        let movedCardId = el.getAttribute("id")
        let sourceColumnId = el.getAttribute("data-colid")

        if (targetColumnId === sourceColumnId) {
          // change order of cards in a column
          for (let index = 0; index < childNodes.length; index++) {
            const element = childNodes[index];
            if (element.getAttribute('id')) {
              let body = {
                "column_id": targetColumnId,
                "new_order": index + 1,
                "card_id": element.getAttribute('id')
              }

              this.boardDDService.changeOrderCard(this.boardId, body)
                .subscribe(re => console.log(re))
            }

          }
        } else {

          // getinfo old card
          this.boardDDService.getCardById(this.boardId, sourceColumnId, movedCardId).subscribe(cr => {
            if (cr['columns']) {
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
                if (ars) {
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
            "column_id": element._id,
            "new_order": index + 1
          }
          this.boardDDService.changeOrderColumn(this.boardId, body)
            .subscribe(re => console.log(re))
        }
      })
    );
  }

  ngOnInit(): void {
    this.boardDDService.getById(this.boardId).subscribe(
      res => {
        if (!res || res['error'] || res["_id"] == null || typeof res["_id"] === "undefined") {
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

  _updateOrderCard(targetColumnId, childNodes) {
    for (let index = 0; index < childNodes.length; index++) {
      const element = childNodes[index];
      let body = {
        "column_id": targetColumnId,
        "new_order": index + 1,
        "card_id": element.getAttribute('id')
      }

      this.boardDDService.changeOrderCard(this.boardId, body)
        .subscribe(re => console.log(re))
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  edited(col) {
    col.isEdited = true;
  }

  // Update cloumn name
  editColumnName(event, col) {
    console.log(event.target.value)
    let newColumnName = event.target.value
    let coulmnID = col._id
    this.columnService.updateColumnName(coulmnID, this.boardId, newColumnName).
      subscribe(re => console.log(re))

    col.isEdited = false;
    col.name = newColumnName

    //TODO: call api to update name column here
    // then set in the callback like bellow
  }

  // Delete a column
  deleteColumn(event, col) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Remove Column',
        message: 'Are you sure, you want to remove this column: ' + col.name
      }
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        let columnIdForDelete = col._id
        this.columnService.deleteColumn(columnIdForDelete, this.boardId).
          subscribe(re => console.log(re))

        col.isDeleted = true;
        this.columns = _.without(this.columns, _.findWhere(this.columns, {
          _id: col._id
        }));
      }
    });
  }

  // Add a new column
  addNewColumn(event) {
    let newColumnName = event.target.value
    this.columnService.addNewColumn(this.boardId, newColumnName).
      subscribe(re => {
        this.columns.push(re)
        event.target.value = ""
      })
  }

  addNewCard(event) {
    var match = _.find(this.columns, function(item) { return item._id === event.col_id })
    if (match) {
        match.cards.push(event)
    }
  }
}
