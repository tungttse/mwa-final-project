import { Component, OnInit } from '@angular/core';
import { 
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
  hide = false
  myForm: FormGroup;
  isLogedIn: Boolean = false
  resultResponse: any

  constructor(private formBuilder: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private storageService: StorageService
    ) { 
    
      this.myForm = formBuilder.group({
      'email': ['', [
        Validators.required,
        Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
      ]],
      'password': ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  getErrorMessage() {
    if (this.myForm.get('email').hasError('required')) {
      return 'You must enter a value';
    }
    return this.myForm.get('email').hasError('email') ? 'Not a valid email' : '';
  }

  onSubmit() {
    this.authService.doPostLogin(this.myForm.value).subscribe(
      res => {
        if(res['error']) {
          this.toastr.error('Error', res['error']);
        } else {
          this.storageService.token = res['token']
          this.authService.userInfo = res['userInfo']
          this.isLogedIn = true
          this.router.navigateByUrl('/boards');
        }
      }
    )
  }
}
