import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../shared/services/authentication.service';
import { UserModel } from '../shared/models/user';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  showLogin = false;
  loading = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submit() {
    this.submitted = true;
    this.loading = true;
    if (this.loginForm.invalid) {
      setTimeout(() => {
        this.loading = false;
      }, 1000);
      return;
    }
    this.loginForm.disable();
    const data = this.loginForm.value;
    this.authService.signIn(data).subscribe(res => {
      if (res.success) {
        setTimeout(() => {
          this.snackBar.open('Login Success', 'OK', {
            duration: 3 * 1000,
            verticalPosition: 'top',
            panelClass: 'successSnackbar'
          });
          this.router.navigate(['./homepage']);
        }, 1000);
      } else {
        setTimeout(() => {
          this.snackBar.open('Invalid Email or Password', 'OK', {
            duration: 3 * 1000,
            verticalPosition: 'top',
            panelClass: 'errorSnackbar'
          });
          this.loginForm.enable();
          this.submitted = false;
          this.loading = false;
        }, 1000);
      }
    }, err => {
      setTimeout(() => {
        console.log(err);
        this.loginForm.enable();
        this.submitted = false;
        this.loading = false;
      }, 500);
    })
  }

  get form() {
    return this.loginForm.controls;
  }

}
