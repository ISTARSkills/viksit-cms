import { AuthService } from '../services/auth/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common'
import { Task } from '../pojo/complex/task';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})



export class DashboardComponent implements OnInit {
  formatdate = 'dd/MM/yyyy h:mm:ss a';
  pipe = new DatePipe('en-US');
  tasks;
  complex_object
  storedTasks;
  public config: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 3,
    observer: true,
    keyboard: true,
    mousewheel: false,
    scrollbar: false,
    navigation: true,
    pagination: false,
    slidesPerGroup: 3
  };


  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer) {

  }
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  ngOnInit() {
    const now = Date.now() - 1;
    const myFormattedDate = this.pipe.transform(now, this.formatdate);
    //console.log(myFormattedDate);
    const local_complex_object = localStorage.getItem('currentUser')

    this.complex_object = JSON.parse(local_complex_object);
    this.tasks = this.complex_object.tasks;
    this.storedTasks = this.tasks;
    //console.log(this.tasks);

    const req = this.auth.getComplexForUpdateTask(this.complex_object.id);
    req.subscribe(
      // Successful responses call the first callback.
      data => {
        //console.log(data);
        this.auth.login(data);
        this.auth.updatedTask.subscribe(tasks => this.tasks = tasks)
      },
      // Errors will call this callback instead:
      err => {
        console.log('Something went wrong!');

      }
    );

  }

  setTask(taskType: string) {
    this.tasks = this.storedTasks
    switch (taskType) {
      case "Course":
        console.log("course " + taskType);
        this.tasks = this.storedTasks.filter((item: Task) => item.itemType === "COURSE_CREATION_TASK");


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

  getActionByStatus(task) {

    switch (task.itemType.trim().toLowerCase()) {
      case 'course_creation_task':

        if (task.status === 'REVIEW') {

          return 'Review Course';


        } else if (task.status === 'ASSIGNED' || task.status === 'CREATED') {

          return 'Create Course';
        } else if (task.status === 'INPROGRESS') {

          return 'Edit Course';
        }

        break;
      case 'lesson_creation_task':

        if (task.status === 'REVIEW') {

          return 'Review Lesson';


        } else if (task.status === 'ASSIGNED' || task.status === 'CREATED') {

          return 'Create Lesson';
        } else if (task.status === 'INPROGRESS') {

          return 'Edit Lesson';
        }

        break;

    }

  }
  goToTask(task: Task) {
    console.log(task.itemType.trim().toLowerCase())
    switch (task.itemType.trim().toLowerCase()) {
      case 'course_creation_task':

        if (task.status === 'REVIEW') {
          this.router.navigate(['/review_task/' + task.id], { relativeTo: this.route });

        } else if (task.status === 'CREATED' || task.status === 'ASSIGNED' || task.status === 'INPROGRESS') {
          this.router.navigate(['/course/' + task.id], { relativeTo: this.route });
        }

        break;
      case 'lesson_creation_task':


        if (task.status === 'REVIEW') {

        } else if (task.status === 'CREATED' || task.status === 'ASSIGNED' || task.status === 'INPROGRESS') {
          this.router.navigate(['/lesson_builder/' + task.itemId], { relativeTo: this.route });
        }

        break;

    }
  }
}
