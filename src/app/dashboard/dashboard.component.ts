import { AuthService } from '../services/auth/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common'
import { Task } from '../pojo/complex/task';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  formatdate = 'dd/MM/yyyy h:mm:ss a';
  pipe = new DatePipe('en-US');
  tasks;
  complex_object;
  storedTasks;

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {


  }

  ngOnInit() {
    //  this.carousel.interval = -1;

    const now = Date.now() - 1;
    const myFormattedDate = this.pipe.transform(now, this.formatdate);
    console.log(myFormattedDate);
    const local_complex_object = localStorage.getItem('currentUser')

    this.complex_object = JSON.parse(local_complex_object);
    this.tasks = this.complex_object.tasks.slice(0, 6);
    this.storedTasks = this.tasks.slice(0, 6);
    console.log(this.tasks.slice(0, 6))
  }




  slideConfig = { "slidesToShow": 3, "slidesToScroll": 3, infinite: false };


  afterChange(e) {
    console.log('afterChange');
  }

  filterSlides(slides: Array<any>) {
    return slides.slice(0, 7);

  }

  setTask(taskType: string) {
    this.tasks = this.storedTasks

    switch (taskType) {
      case "Course":
        console.log("course " + taskType);
        this.tasks = this.storedTasks.filter((item: Task) => item.itemType === "COURSE_CREATION_TASK");


        // item.taskType === 'COURSE_CREATION_TASK'
        console.log(this.tasks.length)

        break;
      case "Lesson":
        console.log("Lession " + taskType);
        this.tasks = this.storedTasks.filter((item: Task) => item.itemType === "LESSON_CREATION_TASK");
        console.log(this.tasks.length)

        break;
      default: console.log("deafult " + taskType);
        this.tasks = this.storedTasks;
    }
  }



  searchTask(s: string) {
    this.tasks = this.storedTasks

    if (s.trim() === "") {
      console.log('its empty');
      this.tasks = this.storedTasks
    } else {
      var re = s.toLowerCase().trim();
      console.log(re);
      this.tasks = this.storedTasks.filter((item: Task) => item.title.toLowerCase().trim().indexOf(re) > -1);
      console.log(this.tasks.length);

    }


  }


  goToTask(task: Task) {
    console.log(task.itemType.trim().toLowerCase())
    switch (task.itemType.trim().toLowerCase()) {
      case 'lesson_creation_task':
        this.router.navigate(['../course/' + task.itemId], { relativeTo: this.route });

        break;
      case 'course_creation_task':
        this.router.navigate(['../course/' + task.itemId]);

        break;

    }
  }
}
