import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from './shared/services/authentication.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomepageComponent } from './homepage/homepage.component';
import { AuthGuard } from './shared/auth.guard';
import { JwtInterceptor } from './shared/jwt.interceptor';
import { SnackbarComponent } from './shared/components/snackbar/snackbar.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, HomepageComponent, SnackbarComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatCardModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [SnackbarComponent]
})
export class AppModule {}
