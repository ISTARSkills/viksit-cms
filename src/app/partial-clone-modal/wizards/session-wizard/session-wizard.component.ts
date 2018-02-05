import { Component, OnInit, Input, ViewChild } from '@angular/core';
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
  selectedExistingOrNewModel = 'EXISTING';
  sessionsNewModuleModel = "";
  newSessionNameModel = "";
  @Input() courses;
  @Input() selectedCourseModal;
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
  constructor() { }

  ngOnInit() {
    for (let module of this.selectedCourseModal.modules) {
      for (let session of module.sessions) {
        this.sessionList.push({ id: session.id, name: session.name });
      }
    }
    this.showExisting = true;
    for (let course of this.courses) {
      this.courseList.push({ id: course.id, name: course.name });
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
      this.courseSelectModel = "";
      this.moduleSelectModel = "";
      this.showExisting = false;
    } else {
      this.sessionsNewModuleModel = "";
      this.showExisting = true;
    }
  }

  onCourseChange(courseSelected: any) {
    console.log('course sekected ' + this.courseSelectModel.name + ' jjjj ' + courseSelected.name);
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
    console.log(term);
    console.log(type);
    this.checkFlag(type, true);
    term = term.trim();
    if (term === '') {
      this.checkFlag(type, false);
      return of(value);
    }
    value = value.filter(v => (v.name.toLowerCase().indexOf(term.toLowerCase()) > -1 || v.id == term || ((v.id + ' ' + v.name.toLowerCase()).indexOf(term.toLowerCase()) > -1)));
    console.log(value);
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
      console.log(this.wizard.model.currentStepIndex);
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
      console.log(this.wizard);
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
}
