import { AppConfiguration } from './../../app.constants';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {
  public tasks = new BehaviorSubject<Object>(null);
  updatedTask = this.tasks.asObservable();
  constructor(private http: HttpClient) { }

  public authenticate(email, password) {
    const body = new HttpParams()
      .set('email', email)
      .set('password', password);
    return this.http.post(AppConfiguration.ServerWithApiUrl + 'auth/login', body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }
  public login(data) {
    this.tasks.next(data.tasks);
    localStorage.setItem('currentUser', JSON.stringify(data));
  }
  logout() {

    sessionStorage.removeItem('lesson');
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }


  public getComplexForUpdateTask(id) {
    // http://localhost:8080/istar/rest/user/197799/complex
    return this.http.get(AppConfiguration.ServerWithApiUrl + 'user/' + id + '/complex', {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }

}
