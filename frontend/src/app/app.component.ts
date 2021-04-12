import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'] 
})

export class AppComponent {
  title = 'Authentication Application';
  userInfoData: Object = null
  private user = new Subject();
  public userInfo$ = this.user.asObservable();

  constructor(private authService: AuthService) {
    this.userInfo$ = this.authService.user$;
    this.userInfoData = this.authService.userInfo
  }
}
