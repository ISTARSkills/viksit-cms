import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { WizardComponent } from 'ng2-archwizard';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/catch';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Lesson } from '../../../pojo/lesson/lesson';
import { Module } from '../../../pojo/module/module';
import { Session } from '../../../pojo/session/session';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http/';
import { AppConfiguration } from '../../../app.constants';

@Component({
  selector: 'app-session-wizard',
  templateUrl: './session-wizard.component.html',
  styleUrls: ['./session-wizard.component.css']
})
export class SessionWizardComponent implements OnInit {
  progress = 50;
  isOn = true;
  isDisabled = false;
  progressWidth1 = 0;
  progressWidth2 = 0;
  currentprogress = 0;
  courseFailed = false;
  moduleFailed = false;
  sessionFailed = false;
  lessonFailed = false;
  showExisting: boolean;
  moduleFiltered = [];
  courseList = [];
  sessionList = [];
  isValid = true;
  checkValid = true;
  disableOnFinish = true;
  selectedExistingOrNewModel = 'EXISTING';
  sessionsNewModuleModel = "";
  newSessionNameModel = "";
  @Input() courses;
  @Output() coursesChange = new EventEmitter<any>();
  @Input() loading;
  @Output() loadingChange = new EventEmitter<any>();
  @Input() selectedCourseModal;
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
  complex_object;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    const local_complex_object = localStorage.getItem('currentUser')
    this.complex_object = JSON.parse(local_complex_object);
    for (let module of this.selectedCourseModal.modules) {
      for (let session of module.sessions) {
        this.sessionList.push({ id: session.id, name: session.name });
      }
    }
    this.showExisting = true;
    for (let course of this.courses) {
      if (!course.isPublished) {
        this.courseList.push({ id: course.id, name: course.name });
      }
    }
  }
  @ViewChild('sessionSelectionInstance') sessionSelectionInstance: NgbTypeahead;
  @ViewChild('sessionCourseSelectioninstance') sessionCourseSelectioninstance: NgbTypeahead;
  @ViewChild('sessionModuleSelectionInstance') sessionModuleSelectionInstance: NgbTypeahead;
  courseSelectfocus$ = new Subject<string>();
  courseSelectclick$ = new Subject<string>();
  moduleSelectfocus$ = new Subject<string>();
  moduleSelectclick$ = new Subject<string>();
  sessionSelectfocus$ = new Subject<string>();
  sessionSelectclick$ = new Subject<string>();
  courseSelectModel = null;
  moduleSelectModel = null;
  sessionSelectModel = null;

  courseSearch = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.courseSelectfocus$)
      .merge(this.courseSelectclick$.filter(() => !this.sessionCourseSelectioninstance.isPopupOpen()))
      .switchMap(term => this.searchFilterValidation(term, this.courseList, 'course')
        .do(() => {
        }
        )
        .catch(() => {
          this.courseFailed = true;
          return of([]);
        }));
  courseFormatter = (x: { name: string, id: number }) => x.id + ' ' + x.name;

  moduleSearch = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.moduleSelectfocus$)
      .merge(this.moduleSelectclick$.filter(() => !this.sessionModuleSelectionInstance.isPopupOpen()))
      .switchMap(term => this.searchFilterValidation(term, this.moduleFiltered, 'module')
        .do(() => {
        }
        )
        .catch(() => {
          this.moduleFailed = true;
          return of([]);
        }));
  moduleFormatter = (x: { name: string, id: number }) => x.id + ' ' + x.name;

  sessionSearch = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.sessionSelectfocus$)
      .merge(this.sessionSelectclick$.filter(() => !this.sessionSelectionInstance.isPopupOpen()))
      .switchMap(term => this.searchFilterValidation(term, this.sessionList, 'session')
        .do(() => {
        }
        )
        .catch(() => {
          this.sessionFailed = true;
          return of([]);
        }));
  sessionFormatter = (x: { name: string, id: number }) => x.id + ' ' + x.name;

  onFilterChange(e: any) {
    if (e === "NEW") {
      this.moduleSelectModel = "";
      this.showExisting = false;
    } else {
      this.sessionsNewModuleModel = "";
      this.showExisting = true;
    }
  }

  onCourseChange(courseSelected: any) {
    //console.log('course sekected ' + this.courseSelectModel.name + ' jjjj ' + courseSelected.name);
    this.moduleSelectModel = null;
    if (courseSelected == "") {
      this.moduleFiltered = [];

    }

    for (let course of this.courses) {
      if (course.id == courseSelected.id) {
        for (let module of course.modules) {
          this.moduleFiltered.push({ id: module.id, name: module.name });
        }
      }
    }
  }

  searchFilterValidation(term: string, value: any, type) {
    //console.log(term);
    //console.log(type);
    this.checkFlag(type, true);
    term = term.trim();
    if (term === '') {
      this.checkFlag(type, false);
      return of(value);
    }
    value = value.filter(v => (v.name.toLowerCase().indexOf(term.toLowerCase()) > -1 || v.id == term || ((v.id + ' ' + v.name.toLowerCase()).indexOf(term.toLowerCase()) > -1)));
    //console.log(value);
    if (value.length != 0) {
      this.checkFlag(type, false);
      return of(value);
    } else {
      return of([]);
    }
  }
  checkFlag(input, flag) {

    switch (input) {
      case "course":
        this.courseFailed = flag;
        break;
      case "module":
        this.moduleFailed = flag;
        break;
      case "session":
        this.sessionFailed = flag;
        break;
      case "lesson":
        this.lessonFailed = flag;
        break;
    }
  }
  enterSecondStep($event) {

    if (this.wizard != undefined) {
      //console.log(this.wizard.model.currentStepIndex);
      this.currentprogress = this.wizard.model.currentStepIndex;
      if (this.wizard.model.currentStepIndex == 0) {
        this.progressWidth1 = 0;
        this.progressWidth2 = 0;
        this.isOn = true;
      }
      if (this.wizard.model.currentStepIndex == 1) {
        this.progressWidth1 = 33;
        this.progressWidth2 = 0;
        this.isOn = true;
        this.isDisabled = true;
      } if (this.wizard.model.currentStepIndex == 2) {
        this.progressWidth2 = 34;
        this.isOn = true;
        this.isDisabled = true;
      }

    } else {
      //console.log(this.wizard);
      this.progressWidth1 = 0;
      this.progressWidth2 = 0;
      this.currentprogress = 0;
      this.isOn = true;
    }


    /*  if ($event === 0) {
       this.progress = this.progress + 50;
     } else {
       this.progress = this.progress - 50;
     }
  */
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

  submitSessionClone() {
    var clonedObject;
    var oldlessonIds = Array();
    //console.log(this.selectedCourseModal);
    var sessions = Array();
    for (let module of this.selectedCourseModal.modules) {
      for (let session of module.sessions) {
        if (session.id == this.sessionSelectModel.id) {
          var lessons = Array();
          for (let lesson of session.lessons) {
            var newLesson = new Lesson(lesson.name, lesson.description, lesson.status, lesson.imageUrl, null, lesson.type);
            lessons.push(newLesson);
            oldlessonIds.push(lesson.id);
          }
          var newSession = new Session(this.newSessionNameModel, session.description, 0, lessons, null);
          sessions.push(newSession);
        }
      }
    }
    for (let course of this.courses) {
      if (course.id == this.courseSelectModel.id) {
        if (this.showExisting) {
          for (let module of course.modules) {
            if (module.id == this.moduleSelectModel.id) {
              for (let new_session of sessions) {
                module.sessions.push(new_session);
              }
              //console.log(course);
              clonedObject = course;
              break;
            }
          }
        } else {
          var newModule = new Module(this.sessionsNewModuleModel, "NA", 0, sessions, "", "", null);
          course.modules.push(newModule);
          clonedObject = course;
        }
      }
    }

    var assignee_object = {
      "userAssingedTo": [this.complex_object.id],
      "dueDate": this.getTodayDate(),
      "clone": "session",
      "oldId": oldlessonIds
    };
    this.disableOnFinish = false;
    this.loading = true;
    this.loadingChange.emit(this.loading);
    const body = new HttpParams().set('course_object', JSON.stringify(clonedObject)).set('assignee_object', JSON.stringify(assignee_object));
    this.http.post(AppConfiguration.ServerWithApiUrl + 'course/1/clone_task/' + this.complex_object.id, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    }).subscribe(res => {
      //console.log(res['data']);
      this.courses = res['data'];
      this.coursesChange.emit(this.courses);
      this.loading = false;
      this.loadingChange.emit(this.loading);
    }, error => {
      this.disableOnFinish = true;
      this.loading = false;
      this.loadingChange.emit(this.loading);
    });
  }
  isValidForm() {
    this.isValid = false;
    if (this.sessionSelectModel != null && this.newSessionNameModel != undefined && this.newSessionNameModel.trim() != '' && this.newSessionNameModel.trim().length > 3) {
      this.isValid = true;
    }
    return this.isValid;
  }
  isValid2() {
    this.checkValid = false;
    if ((this.courseSelectModel != null && this.courseSelectModel != '' && this.moduleSelectModel != null && this.moduleSelectModel != '')
      || (this.courseSelectModel != null && this.courseSelectModel != '' && this.sessionsNewModuleModel != null && this.sessionsNewModuleModel.trim() != '' && this.sessionsNewModuleModel.trim().length > 3)) {
      this.checkValid = true;
    }
    return this.checkValid;
  }
}
