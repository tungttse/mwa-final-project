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

@Component({
  template: '',
})
export class LogoutComponent implements OnInit {
  hide = false
  myForm: FormGroup;
  isLogedIn: Boolean = false
  resultResponse: any

  constructor(private formBuilder: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService
    ) { 
      this.authService.logout();
      this.router.navigate(['login']);

  }
  ngOnInit(): void {}
}
