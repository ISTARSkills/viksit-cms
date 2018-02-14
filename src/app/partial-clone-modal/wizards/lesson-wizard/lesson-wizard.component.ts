import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
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
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http/';
import { AppConfiguration } from '../../../app.constants';

@Component({
  selector: 'app-lesson-wizard',
  templateUrl: './lesson-wizard.component.html',
  styleUrls: ['./lesson-wizard.component.css']
})
export class LessonWizardComponent implements OnInit {
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
  sessionFiltered = [];
  lessonList = [];
  courseList = [];
  moduleList = [];
  isValid = true;
  checkValid = true;
  disableOnFinish = true;
  selectedExistingOrNewModel = 'EXISTING';
  lessonsNewSessionModel = "";
  newLessonNameModel = "";
  complex_object;
  @Input() courses;
  @Output() coursesChange = new EventEmitter<any>();
  @Input() selectedCourseModal;
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    const local_complex_object = localStorage.getItem('currentUser')
    this.complex_object = JSON.parse(local_complex_object);
    for (let module of this.selectedCourseModal.modules) {
      for (let session of module.sessions) {
        for (let lesson of session.lessons) {
          this.lessonList.push({ id: lesson.id, name: lesson.name });
        }
      }
    }
    this.showExisting = true;
    for (let course of this.courses) {
      this.courseList.push({ id: course.id, name: course.name });
    }
  }
  @ViewChild('lessonSelectionInstance') lessonSelectionInstance: NgbTypeahead;
  @ViewChild('lessonCourseSelectioninstance') lessonCourseSelectioninstance: NgbTypeahead;
  @ViewChild('lessonModuleSelectionInstance') lessonModuleSelectionInstance: NgbTypeahead;
  @ViewChild('lessonSessionSelectionInstance') lessonSessionSelectionInstance: NgbTypeahead;
  lessonSelectfocus$ = new Subject<string>();
  lessonSelectclick$ = new Subject<string>();
  courseSelectfocus$ = new Subject<string>();
  courseSelectclick$ = new Subject<string>();
  moduleSelectfocus$ = new Subject<string>();
  moduleSelectclick$ = new Subject<string>();
  sessionSelectfocus$ = new Subject<string>();
  sessionSelectclick$ = new Subject<string>();
  lessonSelectModel = null;
  courseSelectModel = null;
  moduleSelectModel = null;
  sessionSelectModel = null;

  lessonSearch = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.lessonSelectfocus$)
      .merge(this.lessonSelectclick$.filter(() => !this.lessonSelectionInstance.isPopupOpen()))
      .switchMap(term => this.searchFilterValidation(term, this.lessonList, 'lesson')
        .do(() => {
        }
        )
        .catch(() => {
          this.lessonFailed = true;
          return of([]);
        }));
  lessonFormatter = (x: { name: string, id: number }) => x.id + ' ' + x.name;

  courseSearch = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.courseSelectfocus$)
      .merge(this.courseSelectclick$.filter(() => !this.lessonCourseSelectioninstance.isPopupOpen()))
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
      .merge(this.moduleSelectclick$.filter(() => !this.lessonModuleSelectionInstance.isPopupOpen()))
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
      .merge(this.sessionSelectclick$.filter(() => !this.lessonSessionSelectionInstance.isPopupOpen()))
      .switchMap(term => this.searchFilterValidation(term, this.sessionFiltered, 'session')
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
      this.courseSelectModel = "";
      this.moduleSelectModel = "";
      this.showExisting = false;
    } else {
      this.lessonsNewSessionModel = "";
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

  onModuleChange(moduleSelected: any) {
    //console.log(this.courseSelectModel.name + '  --  ' + this.moduleSelectModel.name);
    this.sessionSelectModel = null;
    if (moduleSelected == "") {
      this.sessionFiltered = [];
    }

    for (let course of this.courses) {
      if (course.id == this.courseSelectModel.id) {
        for (let module of course.modules) {
          if (module.id == moduleSelected.id) {
            for (let session of module.sessions) {
              this.sessionFiltered.push({ id: session.id, name: session.name });
            }
          }
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
  }

  submitLessonClone() {
    var clonedObject;
    //console.log(this.selectedCourseModal);
    var lessons = Array();
    for (let module of this.selectedCourseModal.modules) {
      for (let session of module.sessions) {
        for (let lesson of session.lessons) {
          if (lesson.id == this.lessonSelectModel.id) {
            var newLesson = new Lesson(this.newLessonNameModel, lesson.description, lesson.status, lesson.imageUrl, null, lesson.type);
            lessons.push(newLesson);
          }
        }
      }
    }

    for (let course of this.courses) {
      if (course.id == this.courseSelectModel.id) {
        //console.log(course);
        for (let module of course.modules) {
          if (module.id == this.moduleSelectModel.id) {
            if (this.showExisting) {
              for (let session of module.sessions) {
                if (session.id == this.sessionSelectModel.id) {
                  for (let new_lesson of lessons) {
                    session.lessons.push(new_lesson);
                  }
                  //console.log(course);
                  clonedObject = course;
                  break;
                }
              }
            } else {
              var newSession = new Session(this.lessonsNewSessionModel, "NA", 0, lessons, null);
              module.sessions.push(newSession);
              clonedObject = course;
              //console.log(course);
              break;
            }
          }
        }
        break;
      }
    }

    var assignee_object = {
      "userAssingedTo": [this.complex_object.id],
      "dueDate": "08/03/2018"
    };
    this.disableOnFinish = false;
    const body = new HttpParams().set('course_object', JSON.stringify(clonedObject)).set('assignee_object', JSON.stringify(assignee_object));
    this.http.post(AppConfiguration.ServerWithApiUrl + 'course/1/clone_task/' + this.complex_object.id, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    }).subscribe(res => {
      //console.log(res['data']);
      this.courses = res['data'];
      this.coursesChange.emit(this.courses);
    }, error => {
      this.disableOnFinish = true;
    });
  }
  isValidForm() {
    this.isValid = false;
    if (this.lessonSelectModel != null && this.newLessonNameModel != undefined && this.newLessonNameModel.trim() != '' && this.newLessonNameModel.trim().length > 3) {
      this.isValid = true;
    }
    return this.isValid;
  }
  isValid2() {
    this.checkValid = false;
    if ((this.courseSelectModel != null && this.courseSelectModel != '' && this.moduleSelectModel != null
      && this.moduleSelectModel != '' && this.sessionSelectModel != null && this.sessionSelectModel != '') ||
      (this.courseSelectModel != null && this.courseSelectModel != '' && this.moduleSelectModel != null
        && this.moduleSelectModel != '' && this.lessonsNewSessionModel != null && this.lessonsNewSessionModel.trim() != ''
        && this.lessonsNewSessionModel.trim().length > 3)) {
      this.checkValid = true;
    }
    return this.checkValid;
  }
}
