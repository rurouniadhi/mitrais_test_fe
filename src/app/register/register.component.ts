import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserModel } from '../shared/models/user';
import { AuthenticationService } from '../shared/services/authentication.service';
import { ValidateEntry } from '../shared/entry.validator';
import { AsYouType } from 'libphonenumber-js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../shared/components/snackbar/snackbar.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  regForm: FormGroup;
  dateBirth = {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    date: [],
    year: []
  };
  submitted = false;
  showLogin = false;
  loading = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.generateBirthOption();
    this.createRegForm();
  }

  createRegForm() {
    this.regForm = this.fb.group({
      mobile_number: ['', [Validators.required, ValidateEntry.indoPhoneValidator()],
        ValidateEntry.takenPhoneValidator(this.authService)
      ],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      date_birth: [''],
      month_birth: [''],
      year_birth: [''],
      gender: [''],
      email: ['', [Validators.required, Validators.email],
        ValidateEntry.takenEmailValidator(this.authService)
      ],
      password: ['', Validators.required],
    });
  }

  mergeObjModel(obj): UserModel {
    const objModel = new UserModel;
    objModel.mobile_number = obj.mobile_number;
    objModel.first_name = obj.first_name;
    objModel.last_name = obj.last_name;
    if (obj.year_birth && obj.month_birth && obj.date_birth) {
      objModel.date_birth = `${obj.year_birth}-${obj.month_birth}-${obj.date_birth}`;
    } else {
      objModel.date_birth = '';
    }
    objModel.gender = obj.gender;
    objModel.email = obj.email;
    objModel.password = obj.password;
    return objModel
  }

  submit() {
    this.submitted = true;
    this.loading = true;
    if (this.regForm.invalid) {
      setTimeout(() => {
        this.loading = false;
      }, 1000);
      return;
    }
    this.regForm.disable();
    const data = this.mergeObjModel(this.regForm.value);
    this.authService.signUp(data).subscribe(res => {
      if (res) {
        setTimeout(() => {
          this.regForm.reset({
            date_birth: '',
            month_birth: '',
            year_birth: ''
          });
          this.regForm.enable();
          this.submitted = false;
          this.loading = false;
          this.showLogin = true;
          this.snackBar.open('Registration success', 'OK', {
            duration: 3 * 1000,
              verticalPosition: 'top',
                panelClass: 'successSnackbar'
          });
        }, 1000);
      }
    }, err => {
      setTimeout(() => {
        this.regForm.enable();
        this.submitted = false;
        this.loading = false;
      }, 1000);
    })
  }

  generateBirthOption() {
    for (let i = 1; i <= 31; i++) {
      this.dateBirth.date.push(i);
    }
    for (let i = 2020; i >= 1905; i--) {
      this.dateBirth.year.push(i)
    }
  }

  get form() {
    return this.regForm.controls;
  }

  formatPhoneNumber(event) {
    if (event.which < 48 || event.which > 57) {
      event.preventDefault();
    }
    const asYouType = new AsYouType('ID');
    const newFormat = asYouType.input(event.target.value);
    event.target.value = newFormat;
    this.form.mobile_number.setValue(newFormat);
  }
}
