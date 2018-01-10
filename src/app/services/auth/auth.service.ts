import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  public authenticate(email, password) {
    const body = new HttpParams()
    .set('email', email)
    .set('password', password);
    return this.http.post('http://192.168.1.22:8080/istar/rest/auth/login', body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }
  public login(data) {
    localStorage.setItem('currentUser', JSON.stringify(data));
  }
   logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }

}
