import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserModel } from '../models/user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<UserModel>;
  public currentUser: Observable<UserModel>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<UserModel>(
      JSON.parse(sessionStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  signIn(objData: FormData) {
    return this.http
      .post<any>(`${environment.apiUrl}/users/login`, objData)
      .pipe(
        map((data) => {
          if (data.success) {
            sessionStorage.setItem('currentUser', JSON.stringify(data));
            this.currentUserSubject.next(data);
          }
          return data;
        })
      );
  }

  signOut() {
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  signUp(objData) {
    return this.http
      .post<any>(`${environment.apiUrl}/users/register`, objData, httpOptions)
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  findByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/users`).pipe(
      map(users => users.data.filter(user => user.email === email)),
      catchError(this.handleError<any>('getItem')));
  }

  findByPhone(phone: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/users`).pipe(
      map(users => users.data.filter(user => user.mobile_number === phone)),
      catchError(this.handleError<any>('getItem')));
  }

  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
