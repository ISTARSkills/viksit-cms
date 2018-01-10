import { AuthService } from '../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import {DatePipe} from '@angular/common'
import { Task } from '../pojo/complex/task';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  formatdate = 'dd/MM/yyyy h:mm:ss a';
  pipe = new DatePipe('en-US');
  tasks:Array<Task>;
  constructor(private auth: AuthService) { }
  
  ngOnInit() {
    const now = Date.now()-1;
    const myFormattedDate = this.pipe.transform(now, this.formatdate);

    console.log(myFormattedDate);
    const complex_object = localStorage.getItem('currentUser')

    const y = JSON.parse(complex_object);
    this.tasks =y.tasks

    console.log(this.tasks.length)
  }



  filterTask(tasks: Array<Task>){
    tasks = tasks.filter(item => this.pipe.transform(item.date, this.formatdate) === this.pipe.transform(new Date(), this.formatdate));
    return tasks;
  }


  
}
