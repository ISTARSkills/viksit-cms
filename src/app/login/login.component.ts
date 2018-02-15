import { AuthService } from '../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
declare var require: any;
const swal = require('sweetalert2');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  showLoader: Boolean;
  progressValue: number;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private auth: AuthService) {
    this.showLoader = false;
    this.progressValue = 25;
  }

  ngOnInit() {

    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['../dashboard'], { relativeTo: this.route });
    } else {
      this.form = new FormGroup({
        email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
        password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]))
      });
    }
  }

  onSubmit() {
    this.showLoader = true;
    this.progressValue = 35;
    if (this.form.valid) {
      console.log('form submitted');
      const req = this.auth.authenticate(this.form.get('email').value, this.form.get('password').value);
      req.subscribe(
        // Successful responses call the first callback.
        data => {
          this.progressValue = 100;

          console.log(data);
          this.auth.login(data);
          this.router.navigate(['../dashboard'], { relativeTo: this.route });
        },
        // Errors will call this callback instead:
        err => {
          this.showLoader = false;
          console.log('Something went wrong!');
          swal({
            type: 'error',
            title: 'Oops... Something went wrong!',
            text: 'Please Check username and password',
          })
        }
      );
    } else {
      this.progressValue = 100;
      console.log('form invalid');
      this.showLoader = false;
    }
  }
  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  isValid(field: string) {
    return this.form.get(field).valid && this.form.get(field).touched;
  }

  displayFieldCss(field: string) {
    return {
      'has-danger': this.isFieldValid(field),
      'has-success': this.isValid(field)
    };
  }

}
