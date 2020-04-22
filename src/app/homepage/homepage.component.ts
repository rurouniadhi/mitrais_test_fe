import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  submitted = false;
  currentUser: any;
  gender: string;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser')).currentUser;
    console.log(this.currentUser)
    if (this.currentUser) {
      this.gender = this.currentUser.gender ? (this.currentUser.gender.toLowerCase() === 'male' ? 'Mr' : 'Mrs') : '';
    }
  }

  signOut() {
    this.submitted = true;
    setTimeout(() => {
      this.authService.signOut();
      this.snackBar.open('Logout Success', 'OK', {
        duration: 3 * 1000,
        verticalPosition: 'top',
        panelClass: 'successSnackbar'
      });
      this.router.navigate(['./login']);
    }, 500);
  }
}
