import { AuthService } from '../services/auth/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  logoutString: String;
  @Input() userName: String;
  complex_object;
  userType: string;
  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.logoutString = 'click to logout';
    const local_complex_object = localStorage.getItem('currentUser')

    this.complex_object = JSON.parse(local_complex_object);
    this.userType = this.complex_object.studentProfile.userType;
  }

  public logout() {
    this.logoutString = 'logout ho gaya';

    this.auth.logout();
    this.router.navigate(['../login'], { relativeTo: this.route });

  }

}
