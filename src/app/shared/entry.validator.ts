import { AuthenticationService } from './services/authentication.service';
import { AbstractControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { parse, isValidNumber, getPhoneCode, AsYouType } from 'libphonenumber-js';

export class ValidateEntry {
  static takenEmailValidator(authService: AuthenticationService) {
    return (control: AbstractControl) => {
      return authService.findByEmail(control.value).pipe(map(res => {
        return res.length > 0 ? { emailTaken: true } : null;
      }));
    }
  }

  static takenPhoneValidator(authService: AuthenticationService) {
    return (control: AbstractControl) => {
      return authService.findByPhone(control.value).pipe(map(res => {
        return res.length > 0 ? { phoneTaken: true } : null;
      }));
    }
  }

  static indoPhoneValidator() {
    return (control: AbstractControl) => {
      const valid: boolean = isValidNumber(parse(control.value ? control.value.toString() : '', 'ID'));
      return !valid ? { invalidIdPhone: true } : null;
    }
  }
}
