import { Component, OnInit } from '@angular/core';
import { BoardService } from '../services/board.service'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragulaService } from "ng2-dragula";
import { Subscription } from "rxjs";
@Component({
  selector: 'board-detail',
  templateUrl: 'board-detail.component.html',
  styleUrls: ['board-detail.component.css']
})
export class BoardDetailComponent implements OnInit {
  //TODO: add spiner state
  content: String = "fetching..."
  isEdited = false;
  inputAdded = false;

  //TODO: hardcode
  public columns: Array<any> = [
    {
      name: 'Todo',
      cards: [{ name: 'Item A' }, { name: 'Item B' }, { name: 'Item C' }, { name: 'Item D' }]
    },
    {
      name: 'Doing',
      cards: [{ name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 3' }, { name: 'Item 4' }]
    },

    {
      name: 'Verifying',
      cards: [{ name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 3' }, { name: 'Item 4' }]
    },

    {
      name: 'Done',
      cards: [{ name: 'Item 1' }]
    },
  ];

  subs = new Subscription();
  constructor(
    private boardService: BoardService,
    private dragulaService: DragulaService
  ) {

    this.dragulaService.createGroup("COLUMNS", {
      direction: 'horizontal',
      moves: (el, source, handle) => {
        return handle.className === "group-handle"
      }
    });

    this.subs.add(this.dragulaService.dropModel("COLUMNS")
      .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
        console.log('dropModel:', el, source, target, sourceModel, targetModel, item);
      })
    );
    this.subs.add(this.dragulaService.removeModel("COLUMNS")
      .subscribe(({ el, source, item, sourceModel }) => {
        console.log('removeModel:');
        console.log(el);
        console.log(source);
        console.log(sourceModel);
        console.log(item);
      })
    );

    this.subs.add(this.dragulaService.drag("COLUMNS")
      .subscribe(({ name, el, source }) => {
        console.log("drag ", name, el, source)
      })
    );
    this.subs.add(this.dragulaService.drop("COLUMNS")
      .subscribe(({ name, el, target, source, sibling }) => {
        console.log("drop ", name, el,target,  source, sibling)
      })
    );
    

    // You can also get all events, not limited to a particular group
    this.subs.add(this.dragulaService.drop()
      .subscribe(({ name, el, target, source, sibling }) => {
        console.log("drop catch all ", name, el,target,  source, sibling)
      })
    );


  }

  ngOnInit(): void {
    this.boardService.get().subscribe(
      res => {
        if (res['error']) {
          this.content = "Error " + res['error']
        }
        this.content = res['data']
      }
    )
  }

  edited() {
    this.isEdited = true;
  }

  apply(content) {
    this.columns[0].name = content;
    this.inputAdded = true;
  }


}
