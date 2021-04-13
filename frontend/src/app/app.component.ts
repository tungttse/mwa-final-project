import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Subject } from 'rxjs';
import { UserService } from './services/user.service';

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
  private fName : String = ""

  constructor(private authService: AuthService,private userService: UserService) {
    this.userInfo$ = this.authService.user$;
    this.userInfoData = this.authService.userInfo
  }

  ngOnInit() {
    this.userService.getUserInfo().subscribe(
      res => {
        console.log(res['first_name'])
        this.fName = res['first_name']
      }
    );
  }
}
