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
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.component.html',
  styleUrls: [ 'signup.component.css' ]
})
export class SignupComponent {
  hide: Boolean = true
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