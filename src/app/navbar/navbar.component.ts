import {AuthService} from '../services/auth/auth.service';
import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  logoutString: String;
  userName: String;
  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.logoutString = 'click to logout';
    this.userName = 'Archnae';
  }

  public logout() {
    this.logoutString = 'logout ho gaya';

    this.auth.logout();
    this.router.navigate(['../login'], {relativeTo: this.route});

  }

}
