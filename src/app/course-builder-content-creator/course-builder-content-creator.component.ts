import {
  Component, OnInit, ViewEncapsulation
} from '@angular/core';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Session } from '../pojo/session/session';
import { Lesson } from '../pojo/lesson/lesson';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap/accordion/accordion';
import { Module } from '../pojo/module/module';

@Component({
  selector: 'app-course-builder-content-creator',
  templateUrl: './course-builder-content-creator.component.html',
  styleUrls: ['./course-builder-content-creator.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CourseBuilderContentCreatorComponent implements OnInit {

  formatdate = 'dd/MM/yyyy h:mm:ss a';
  pipe = new DatePipe('en-US');
  complex_object;
  id: string;
  course;
  closeResult: string;
  title = '';
  desc = '';
  type = '';
  constructor(private route: ActivatedRoute, private http: HttpClient, private modalService: NgbModal) {
    this.id = this.route.snapshot.params.id;

  }

  public addModuleComponent = function (course) {
    // var index = this.course.indexOf(module);
    var lessons = Array();
    var sessions = Array();
    var newLesson = new Lesson("New Lesson", "New Lesson Desc", 0, 'INCOMPLETE')
    lessons.push(newLesson);
    var newSession = new Session("New Session", "New Session Desc", 0, lessons)
    sessions.push(newSession);
    var newModule = new Module("New Module", "New Module Desc", 0, sessions, "", "INCOMPLETE")
    console.log("newModule " + JSON.stringify(newModule));
    this.course.modules.push(newModule);
    console.log(this.course);
  };


  public removeModuleFunction = function (module) {
    var index = this.course.modules.indexOf(module);
    this.course.modules.splice(index, 1);
    console.log(this.course);
  };

  public addSessionComponent = function (module) {
    var index = this.course.modules.indexOf(module);
    var lessons = Array();
    var newLesson = new Lesson("New Lesson", "New Lesson Desc", 0, 'INCOMPLETE')
    lessons.push(newLesson);
    var newSession = new Session("New Session", "NewSession Desc", 0, lessons)
    console.log("newSession " + JSON.stringify(newSession));
    this.course.modules[index].sessions.push(newSession);
    console.log(this.course);
  };

  public removeSessionsFunction = function (module, session) {
    var moduleIndex = this.course.modules.indexOf(module);
    var sessionIndex = this.course.modules[moduleIndex].sessions.indexOf(session);

    this.course.modules[moduleIndex].sessions.splice(sessionIndex, 1);
    console.log(this.course);
  };

  public addLessonsComponent = function (module, session) {
    var moduleIndex = this.course.modules.indexOf(module);
    var sessionIndex = this.course.modules[moduleIndex].sessions.indexOf(session);
    var newLesson = new Lesson("New Lesson", "New Lesson Desc", 0, "INCOMPLETE")
    console.log("newSession " + JSON.stringify(newLesson));
    this.course.modules[moduleIndex].sessions[sessionIndex].lessons.push(newLesson);
    console.log(this.course);
  };

  public removeLessonsFunction = function (module, session, lesson) {
    var moduleIndex = this.course.modules.indexOf(module);
    var sessionIndex = this.course.modules[moduleIndex].sessions.indexOf(session);
    var lessonIndex = this.course.modules[moduleIndex].sessions[sessionIndex].lessons.indexOf(lesson);
    this.course.modules[moduleIndex].sessions[sessionIndex].lessons.splice(lessonIndex, 1);
    console.log(this.course);
  };


  open(type, value, content) {
    this.type = 'Edit ' + type;
    this.title = value.name;
    this.desc = value.description;
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  save(content) {


    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  onUploadSuccess(file) {

    console.log(file);
    console.log(file[0].upload.filename);
    console.log(file[0].type);
  }


  onUploadError(file) {

    console.log(file);
    console.log(file[0].upload.filename);
    console.log(file[0].type);
  }
  ngOnInit() {
    const now = Date.now() - 1;
    const myFormattedDate = this.pipe.transform(now, this.formatdate);
    const local_complex_object = localStorage.getItem('currentUser')

    this.complex_object = JSON.parse(local_complex_object);
    console.log('http://192.168.1.8:8080/istar/rest/course/1/course_structure/' + this.id);
    // Make the HTTP request:
    this.http.get('http://192.168.1.8:8080/istar/rest/course/1/course_structure/' + this.id).subscribe(data => {
      // Read the result field from the JSON response.
      this.course = data['data'];
      console.log(this.course);
    });



  }
}
