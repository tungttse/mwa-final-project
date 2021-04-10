import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  template: `
    <h1>
      {{title}}
    </h1>

  <nav>
    <a routerLink="/">Home</a> | <a routerLink="/login">Login</a> | <a routerLink="/signup">Signup</a> | <a routerLink="/protected"> Protected Area </a>
  </nav>
   
  <div class="outlet">
    <router-outlet></router-outlet>
  </div>
  
`,
  styles: [`
    nav{
      border: 1px solid #e4e4e4; 
      background-color: #e4e4e4;
      margin-bottom: 30px;
    }

    .outlet{
      padding: 30px;
    }
    
  `]
})

export class AppComponent {
  title = 'Authentication Application';

  constructor() {}
}
