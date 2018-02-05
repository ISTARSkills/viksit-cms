import { Component, OnInit, Input, ViewChild } from '@angular/core';
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
  createCourseClone;
  constructor(private http: HttpClient) { }

  ngOnInit() {

  }

  cloneData() {
    console.log(this.selectedCourseModal);
    console.log(this.createCourseClone);

    var modules = Array();
    for (let module of this.selectedCourseModal.modules) {

      var sessions = Array();
      for (let session of module.sessions) {
        var lessons = Array();
        for (let lesson of session.lessons) {
          var newLesson = new Lesson(lesson.name, lesson.description, lesson.status, lesson.imageUrl, null, lesson.type);
          lessons.push(newLesson);
        }
        var newSession = new Session(session.name, session.description, 0, lessons, null);
        sessions.push(newSession);
      }
      var newModule = new Module(module.name, module.description, 0, sessions, module.imageUrl, module.status, null)
      modules.push(newModule);
    }
    var clonedObject = new Course(this.createCourseClone, null, "", this.selectedCourseModal.description, "", "", modules);
    this.courses.push(clonedObject);
    /* const body = new HttpParams().set('course_object', JSON.stringify(clonedObject));
    this.http.post(AppConfiguration.ServerWithApiUrl + 'course/1/edit_course_structure/' + CoursesComponent().complex_object.id + '/' + this.id, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    }).subscribe(res => console.log(res));
 */


  }
}
