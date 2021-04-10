import { Component, OnInit, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

@Component({
  selector: 'app-signup',
  template: `
    <form [formGroup]="myForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label for="email">E-Mail</label>
        <input type="text" class="form-control" id="email" formControlName="email">
        <div *ngIf="!myForm.get('email').valid" class="error">
          {{emailErrorMsg}}
        </div>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" class="form-control" id="password" formControlName="password">
      </div>

      <div class="form-group">
      <label for="password">RePassword</label>
      <input type="password" class="form-control" id="repassword" formControlName="repassword">
      <div *ngIf="myForm.hasError('notSame')" class="error">
        Mismatch password
      </div>
    </div>

     <button type="submit" class="btn btn-primary" [disabled]="!myForm.valid">Submit</button>
  </form>
  `,
  styles: [
    `.error{
      color: red;
      font-size: 10px;
      font-style: italic;
    }`
  ]
})
export class SignupComponent {
  myForm: FormGroup;
  emailErrorMsg: String

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private storageService : StorageService
    ) {
    
    this.myForm = this.formBuilder.group({
      'email': ['abc@gmail.com', [
        Validators.required, 
        Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"),
      ], this.asyncEmailValidator.bind(this)],
      'password': ['',Validators.required],
      'repassword': ['',[Validators.required]],
    }, { validators: this.checkPasswords });

    this.myForm.valueChanges.subscribe(
      (data: any) => {
        if(!this.myForm.get('email').valid){
          this.emailErrorMsg = "invalid email"
        }
        if(this.myForm.get('email').value == "") {
          this.emailErrorMsg = ""
        }
      }
    );
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password').value;
    const confirmPassword = group.get('repassword').value;

    if(password == "" && confirmPassword == "") return null
    return password === confirmPassword ? null : { notSame: true }     
  }
  
  onSubmit() {
    this.authService.doPostSignup(this.myForm.value).subscribe(
      res =>  {
        if(res['error']) {
          alert(res['error'])
        } else {
          this.storageService.token = res['token']
        }
      }
    )
  }

  asyncEmailValidator(control: AbstractControl):  Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if(control.value == "") {
      this.emailErrorMsg = ""
      return new Promise(null)
    }

    return this.authService.doValidateEmail({email: control.value}).pipe(
      map(value => {
        if(value["isValid"]) {
          return null
        } else {
          this.emailErrorMsg = "Email exist"
          return { isExist: true }
        }
      }),
      catchError(() => of(null))
    )
  }
}