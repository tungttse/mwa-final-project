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
  userInfoData: any = null
  private user = new Subject();
  public userInfo$ = this.user.asObservable();
  fName : String = ""
  classBarName = ""

  constructor(
    private authService: AuthService,
    private userService: UserService
    ) {
    this.userInfo$ = this.authService.user$;
    this.userInfoData = this.authService.userInfo
    
    if(this.userInfoData) {
      this.fName = JSON.parse(this.userInfoData).first_name
      this.classBarName = "logined-bar"
    } else {
      this.classBarName = ""
    }
    
    this.userInfo$.subscribe(res=>{
      if(res) {
        this.fName = res['first_name'] ? res['first_name'] : res
        this.classBarName = "logined-bar"
      } else {
        this.classBarName = ""
        this.fName = ""
      }
      
    })
  }

  ngOnInit() {
  }
}
