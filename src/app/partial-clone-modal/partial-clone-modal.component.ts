import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
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
  modules = [];
  courseList = [];
  @Input() courses;
  model: any;
  moduleCloneCourse = null;
  sessionSelectModel = null;
  sessionModuleSelectionModel = null;
  selectedExistingOrNewModel = 'EXISTING';
  showExisting: boolean;
  moduleFiltered = [];
  temp = [];
  courseFailed = false;
  moduleFailed = false;
  sessionFailed = false;
  lessonFailed = false;
  progress = 50;
  constructor() { }

  ngOnInit() {
    for (let module of this.selectedCourseModal.modules) {
      this.modules.push({ id: module.id, name: module.name });
    }
    this.showExisting = true;
    for (let course of this.courses) {
      this.courseList.push({ id: course.id, name: course.name });
    }
  }
  @ViewChild('instance') instance: NgbTypeahead;
  @ViewChild('instanceCourse') instanceCourse: NgbTypeahead;
  @ViewChild('sessionModuleSelectionInstance') sessionSelectInstance: NgbTypeahead;
  @ViewChild('sessionModuleSelectionInstance') sessionModuleSelectionsInstance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  focusCourse$ = new Subject<string>();
  clickCourse$ = new Subject<string>();
  sessionSelectfocus$ = new Subject<string>();
  sessionSelectclick$ = new Subject<string>();
  sessionModuleSelectionfocus$ = new Subject<string>();
  sessionModuleSelectionclick$ = new Subject<string>();
  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.focus$)
      .merge(this.click$.filter(() => !this.instance.isPopupOpen()))
      .map(term => (term === '' ? this.modules : this.modules.filter(v => (v.name.toLowerCase().indexOf(term.toLowerCase()) > -1 || v.id == term))));
  formatter = (x: { name: string, id: number }) => x.id + ' ' + x.name;

  searchCourse = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.focusCourse$)
      .merge(this.clickCourse$.filter(() => !this.instanceCourse.isPopupOpen()))
      .switchMap(term => this.searchFilterValidation(term, this.courseList, 'course')
        .do(() => {
        }
        )
        .catch(() => {
          this.courseFailed = true;
          return of([]);
        }));
  formatterCourse = (x: { name: string, id: number }) => x.id + ' ' + x.name;

  searchSessionSelect = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.sessionSelectfocus$)
      .merge(this.sessionSelectclick$.filter(() => !this.sessionSelectInstance.isPopupOpen()))
      .switchMap(term =>
        this.searchFilterValidation(term, this.modules, 'session')
          .do(() => {
          }
          )
          .catch(() => {
            this.sessionFailed = true;
            return of([]);
          }))
  sessionSelectformatter = (x: { name: string, id: number }) => x.id + ' ' + x.name;

  sessionModuleSelectionSearch = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.sessionModuleSelectionfocus$)
      .merge(this.sessionModuleSelectionclick$.filter(() => !this.sessionModuleSelectionsInstance.isPopupOpen()))
      .switchMap(term =>
        this.searchFilterValidation(term, this.moduleFiltered, 'module')
          .do(() => {
          }
          )
          .catch(() => {
            this.moduleFailed = true;
            return of([]);
          }))
  sessionModuleSelectionformatter = (x: { name: string, id: number }) => x.id + ' ' + x.name;

  searchFilterValidation(term: string, value: any, type) {
    console.log(term);
    console.log(type);
    this.ddd(type, true);
    term = term.trim();
    if (term === '') {
      this.ddd(type, false);
      return of(value);
    }
    value = value.filter(v => (v.name.toLowerCase().indexOf(term.toLowerCase()) > -1 || v.id == term || ((v.id + ' ' + v.name.toLowerCase()).indexOf(term.toLowerCase()) > -1)));
    console.log(value);
    if (value.length != 0) {
      this.ddd(type, false);
      return of(value);
    } else {
      return of([]);
    }
  }

  ddd(input, flag) {

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


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  onFilterChange(e: any) {
    if (e === "NEW") {
      this.moduleCloneCourse = "";
      this.showExisting = false;
    } else {
      this.showExisting = true;
    }
  }

  onCourseChange(courseSelected: any, $event) {
    console.log(this.moduleCloneCourse);
    this.sessionModuleSelectionModel = null;
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
    this.temp = this.moduleFiltered;
  }

  enterSecondStep($event) {
    console.log($event)
    if ($event === 0) {
      this.progress = this.progress + 50;
    } else {
      this.progress = this.progress - 50;
    }

  }
}
