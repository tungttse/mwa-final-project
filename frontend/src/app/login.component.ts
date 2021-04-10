import { Component, OnInit } from '@angular/core';
import { 
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

@Component({
  selector: 'app-login',
  template: `
  <div [hidden]="!isLogedIn">You are logged in</div>
  <form [formGroup]="myForm" (ngSubmit)="onSubmit()" [hidden]="isLogedIn">
    <div class="form-group">
      <label for="email">E-Mail</label>
      <input type="text" class="form-control" id="email" formControlName="email">
      <div *ngIf="!myForm.get('email').valid">
        Invalid Email
      </div>
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" class="form-control" id="password" formControlName="password">
    </div>
    <button type="submit" class="btn btn-primary" [disabled]="!myForm.valid">Submit</button>
</form>
  `,
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  myForm: FormGroup;
  isLogedIn: Boolean = false
  resultResponse: any

  constructor(private formBuilder: FormBuilder, 
    private authService: AuthService,
    private storageService: StorageService
    ) { 
    
      this.myForm = formBuilder.group({
      'email': ['abc@gmail.com', [
        Validators.required,
        Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
      ]],
      'password': ['', Validators.required]
    });

    // this.myForm.valueChanges.subscribe(
    //   (data: any) => console.log(data)
    // );
  }

  ngOnInit(): void {}

  onSubmit() {
    this.authService.doPostLogin(this.myForm.value).subscribe(
      res => {
        if(res['error']) {
          alert(res['error'])
        } else {
          this.storageService.token = res['token']
          this.isLogedIn = true
        }
      }
    )
  }
}
