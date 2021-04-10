import { Component, OnInit } from '@angular/core';
import { ContentService } from './content.service';

@Component({
  selector: 'app-protected',
  template: `
    <p>
      {{content}}
    </p>
  `,
  styles: [
  ]
})
export class ProtectedComponent implements OnInit {
  content: String = "fetching..."
  constructor(private contentService: ContentService ) { }

  ngOnInit(): void {
    this.contentService.get().subscribe(
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
