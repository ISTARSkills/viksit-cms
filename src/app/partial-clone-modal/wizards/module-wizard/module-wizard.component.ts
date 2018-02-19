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
import { Session } from '../../../pojo/session/session';
import { Module } from '../../../pojo/module/module';
import { Course } from '../../../pojo/course';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http/';
import { AppConfiguration } from '../../../app.constants';

@Component({
  selector: 'app-module-wizard',
  templateUrl: './module-wizard.component.html',
  styleUrls: ['./module-wizard.component.css']
})
export class ModuleWizardComponent implements OnInit {
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
  moduleList = [];
  courseList = [];
  disableOnFinish = false;
  selectedExistingOrNewModel = 'EXISTING';
  modulesNewCourseModel = "";
  newModuleNameModel = "";
  isValid = true;
  checkValid = true;
  complex_object;
  @Input() courses;
  @Output() coursesChange = new EventEmitter<any>();
  @Input() loading;
  @Output() loadingChange = new EventEmitter<any>();
  @Input() selectedCourseModal;
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    const local_complex_object = localStorage.getItem('currentUser')
    this.complex_object = JSON.parse(local_complex_object);
    for (let module of this.selectedCourseModal.modules) {
      this.moduleList.push({ id: module.id, name: module.name });
    }
    this.showExisting = true;
    //console.log(this.courseList)
    for (let course of this.courses) {
      this.courseList.push({ id: course.id, name: course.name });
    }
  }
  @ViewChild('moduleSelectionInstance') moduleSelectionInstance: NgbTypeahead;
  @ViewChild('moduleCourseSelectioninstance') moduleCourseSelectioninstance: NgbTypeahead;
  courseSelectfocus$ = new Subject<string>();
  courseSelectclick$ = new Subject<string>();
  moduleSelectfocus$ = new Subject<string>();
  moduleSelectclick$ = new Subject<string>();
  courseSelectModel = null;
  moduleSelectModel = null;


  courseSearch = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.courseSelectfocus$)
      .merge(this.courseSelectclick$.filter(() => !this.moduleCourseSelectioninstance.isPopupOpen()))
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
      .merge(this.moduleSelectclick$.filter(() => !this.moduleSelectionInstance.isPopupOpen()))
      .switchMap(term => this.searchFilterValidation(term, this.moduleList, 'module')
        .do(() => {
        }
        )
        .catch(() => {
          this.moduleFailed = true;
          return of([]);
        }));
  moduleFormatter = (x: { name: string, id: number }) => x.id + ' ' + x.name;

  onFilterChange(e: any) {
    if (e === "NEW") {
      this.courseSelectModel = null;
      this.showExisting = false;
    } else {
      this.showExisting = true;
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
      ////console.log(this.wizard.model.currentStepIndex);
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

  submitModuleClone() {
    var clonedObject;
    var oldlessonIds = Array();
    //console.log(this.selectedCourseModal);
    var modules = Array();
    for (let module of this.selectedCourseModal.modules) {
      if (module.id == this.moduleSelectModel.id) {
        var sessions = Array();
        for (let session of module.sessions) {
          var lessons = Array();
          for (let lesson of session.lessons) {
            var newLesson = new Lesson(lesson.name, lesson.description, lesson.status, lesson.imageUrl, null, lesson.type);
            lessons.push(newLesson);
            oldlessonIds.push(lesson.id);
          }
          var newSession = new Session(session.name, session.description, 0, lessons, null);
          sessions.push(newSession);
        }
        var newModule = new Module(this.newModuleNameModel, module.description, 0, sessions, module.imageUrl, module.status, null)
        modules.push(newModule);
      }
    }

    if (this.showExisting) {
      for (let course of this.courses) {
        if (course.id == this.courseSelectModel.id) {
          for (let new_module of modules) {
            course.modules.push(new_module);
          }
          //console.log(course);
          clonedObject = course;
          break;
        }
      }
    } else {
      var newCourse = new Course(this.modulesNewCourseModel, null, "", "NA", "IT/ITES", "", modules);
      clonedObject = newCourse;
    }

    var assignee_object = {
      "userAssingedTo": [this.complex_object.id],
      "dueDate": this.getTodayDate(),
      "clone": "module",
      "oldId": oldlessonIds
    };

    this.disableOnFinish = true;
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
      this.loading = false;
      this.loadingChange.emit(this.loading);
      this.disableOnFinish = false;
    });
  }
  isValidForm() {
    this.isValid = false;
    if (this.moduleSelectModel != null && this.newModuleNameModel != undefined && this.newModuleNameModel.trim() != '' && this.newModuleNameModel.trim().length > 3) {
      this.isValid = true;
    }
    return this.isValid;
  }
  isValid2() {
    this.checkValid = false;
    if ((this.courseSelectModel != null && this.courseSelectModel != '') || (this.modulesNewCourseModel != null && this.modulesNewCourseModel.trim() != '' && this.modulesNewCourseModel.trim().length > 3)) {
      this.checkValid = true;
    }
    return this.checkValid;
  }
}
