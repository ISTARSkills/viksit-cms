import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http/';
import { AppConfiguration } from '../app.constants';
import { Lesson } from '../pojo/lesson/lesson';
import { Session } from '../pojo/session/session';
import { Module } from '../pojo/module/module';
import { Course } from '../pojo/course';

@Component({
  selector: 'app-partial-clone-modal',
  templateUrl: './partial-clone-modal.component.html',
  styleUrls: ['./partial-clone-modal.component.css']
})
export class PartialCloneModalComponent implements OnInit {
  @Input() dValue;
  @Input() cValue;
  @Input() selectedModal;
  @Input() selectedCourseModal;
  @Input() courses;
  @Output() coursesChange = new EventEmitter<any>();
  createCourseClone;
  complex_object;
  @Input() loading;
  @Output() loadingChange = new EventEmitter<any>();
  disableOnFinish = true;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    const local_complex_object = localStorage.getItem('currentUser')
    this.complex_object = JSON.parse(local_complex_object);
    //console.log('from main')
    //console.log(this.courses.length);
  }

  public getTodayDate() {

    var today = new Date();
    var date = today.getDate();
    var month = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    var dd = "";
    var mm = "";

    if (date < 10) {
      dd = '0' + date;
    } else {
      dd = date + "";
    }
    if (month < 10) {
      mm = '0' + month;
    } else {
      mm = month + "";
    }
    var todayDate = dd + '/' + mm + '/' + yyyy;
    return todayDate;

  }

  cloneData() {
    //console.log(this.selectedCourseModal);
    //console.log(this.createCourseClone);
    var oldlessonIds = Array();
    var modules = Array();
    for (let module of this.selectedCourseModal.modules) {
      var sessions = Array();
      for (let session of module.sessions) {
        var lessons = Array();
        for (let lesson of session.lessons) {
          var newLesson = new Lesson(lesson.name, lesson.description, lesson.status, lesson.imageURL, null, lesson.type);
          lessons.push(newLesson);
          oldlessonIds.push(lesson.id);
        }
        var newSession = new Session(session.name, session.description, 0, lessons, null);
        sessions.push(newSession);
      }
      var newModule = new Module(module.name, module.description, 0, sessions, module.imageURL, module.status, null);
      modules.push(newModule);
    }
    var newCourse = new Course(this.createCourseClone, null, this.selectedCourseModal.imageURL, this.selectedCourseModal.description, "IT/ITES", "", modules);
    var assignee_object = {
      "userAssingedTo": [this.complex_object.id],
      "dueDate": this.getTodayDate(),
      "clone": "course",
      "oldId": oldlessonIds
    };
    //console.log("Course Size before request--> " + this.courses.length)
    this.disableOnFinish = false;
    this.loading = true;
    this.loadingChange.emit(this.loading);
    const body = new HttpParams().set('course_object', JSON.stringify(newCourse)).set('assignee_object', JSON.stringify(assignee_object));
    this.http.post(AppConfiguration.ServerWithApiUrl + 'course/1/clone_task/' + this.complex_object.id, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    }).subscribe(res => {
      //console.log(res['data']);
      this.courses = null;
      this.courses = res['data'];
      this.coursesChange.emit(this.courses);
      this.loading = false;
      this.loadingChange.emit(this.loading);
      //console.log("response");
      //console.log(this.courses);
    }, error => {
      this.loading = false;
      this.loadingChange.emit(this.loading);
      this.disableOnFinish = true;
    });
  }

  updateCourseStructure(updatedCourse) {
    //console.log('called for callback in wizard');
    //console.log(updatedCourse);
    this.coursesChange.emit(updatedCourse);
  }
  updateLoader($event) {
    this.loading = $event;
    this.loadingChange.emit(this.loading);
  }
  isValidForm() {
    var isValid = false;
    if (this.createCourseClone != null && this.createCourseClone.trim() != '' && this.createCourseClone.trim().length > 3) {
      isValid = true;
    } else {
      isValid = false;
    }
    return isValid;
  }
}
