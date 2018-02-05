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
  selectedExistingOrNewModel = 'EXISTING';
  modulesNewCourseModel = "";
  @Input() courses;
  @Input() selectedCourseModal;
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
  constructor() { }

  ngOnInit() {
    for (let module of this.selectedCourseModal.modules) {
      this.moduleList.push({ id: module.id, name: module.name });
    }
    this.showExisting = true;
    console.log(this.courseList)
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
