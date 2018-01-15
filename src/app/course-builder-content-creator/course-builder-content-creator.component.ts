import {
  Component, OnInit
} from '@angular/core';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Session } from '../pojo/session/session';
import { Lesson } from '../pojo/lesson/lesson';



@Component({
  selector: 'app-course-builder-content-creator',
  templateUrl: './course-builder-content-creator.component.html',
  styleUrls: ['./course-builder-content-creator.component.css']
})
export class CourseBuilderContentCreatorComponent implements OnInit {

  formatdate = 'dd/MM/yyyy h:mm:ss a';
  pipe = new DatePipe('en-US');
  complex_object;
  id: string;
  course;


  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.id = this.route.snapshot.params.id;

  }


  public removeModuleFunction = function (module) {
    var index = this.course.modules.indexOf(module);
    this.course.modules.splice(index, 1);
    console.log(this.course);
  };

  public addSessionComponent = function (module) {
    var index = this.course.modules.indexOf(module);
    var lessons = Array();
    var newLesson = new Lesson("New Lesson", "New Lesson Desc", 0)
    lessons.push(newLesson);
    var newSession = new Session("New Session", "NewSession Desc", 0, lessons)
    console.log("newSession " + JSON.stringify(newSession));
    this.course.modules[index].sessions.push(newSession);
    console.log(this.course);
  };

  public removeSessionsFunction = function (module) {
    var index = this.course.modules.indexOf(module);
    this.course.modules.splice(index, 1);
    console.log(this.course);
  };

  public addLessonsComponent = function (module) {
    var index = this.course.modules.indexOf(module);
    var lessons = Array();
    var newLesson = new Lesson("New Lesson", "New Lesson Desc", 0)
    lessons.push(newLesson);
    var newSession = new Session("New Session", "NewSession Desc", 0, lessons)
    console.log("newSession " + JSON.stringify(newSession));
    this.course.modules[index].sessions.push(newSession);
    console.log(this.course);
  };
  public addModuleComponent = function (module) {
    var index = this.course.modules.indexOf(module);
    var lessons = Array();
    var newLesson = new Lesson("New Lesson", "New Lesson Desc", 0)
    lessons.push(newLesson);
    var newSession = new Session("New Session", "NewSession Desc", 0, lessons)
    console.log("newSession " + JSON.stringify(newSession));
    this.course.modules[index].sessions.push(newSession);
    console.log(this.course);
  };


  ngOnInit() {
    console.log(this.id);
    const now = Date.now() - 1;
    const myFormattedDate = this.pipe.transform(now, this.formatdate);
    console.log(myFormattedDate);
    const local_complex_object = localStorage.getItem('currentUser')

    this.complex_object = JSON.parse(local_complex_object);
    console.log('http://192.168.0.111:8080/istar/rest/course/1/course_structure/' + this.id);
    // Make the HTTP request:
    this.http.get('http://192.168.0.111:8080/istar/rest/course/1/course_structure/' + this.id).subscribe(data => {
      // Read the result field from the JSON response.
      this.course = data['data'];
      console.log(this.course);
    });



  }




}
