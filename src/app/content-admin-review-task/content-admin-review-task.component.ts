import { Component, OnInit, ViewChild } from '@angular/core';
import { WizardComponent } from 'ng2-archwizard';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfiguration } from '../app.constants';
import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-content-admin-review-task',
  templateUrl: './content-admin-review-task.component.html',
  styleUrls: ['./content-admin-review-task.component.css']
})
export class ContentAdminReviewTaskComponent implements OnInit {
  progress = 50;
  isOn = true;
  isDisabled = false;
  progressWidth1 = 0;
  progressWidth2 = 0;
  currentprogress = 0;
  complex_object;
  issuesList: any;
  isInclude2ndStep = false;
  newCourse;
  users = [];
  selectedUser = null;
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
  @ViewChild('userSelectionInstance') userSelectionInstance: NgbTypeahead;
  userSelectfocus$ = new Subject<string>();
  userSelectclick$ = new Subject<string>();
  constructor(private http: HttpClient) { }
  myOptions: INgxMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
  };

  // Initialized to specific date (09.10.2018)
  model: any = { date: { year: new Date().getFullYear(), month: new Date().getMonth(), day: new Date().getDay() } };

  // optional date changed callback
  onDateChanged(event: IMyDateModel): void {
    // date selected
  }

  ngOnInit() {
    const local_complex_object = localStorage.getItem('currentUser');
    this.complex_object = JSON.parse(local_complex_object);
    this.http.get(AppConfiguration.ServerWithApiUrl + 'course/1/course_structure/16542645').subscribe(data => {
      // Read the result field from the JSON response.
      this.newCourse = data['data'];
      for (let issue of this.newCourse.issues) {
        for (let comments of issue.comments) {
          this.issuesList.push(comments);
        }

      }
      console.log(this.newCourse);
      this.isInclude2ndStep = true;
    });

    this.http.get(AppConfiguration.ServerWithApiUrl + 'user/user_bytype/CONTENT_CREATOR').subscribe(data => {
      // Read the result field from the JSON response.
      this.users = data['data'];
      console.log(this.users);
    });
  }

  userSearch = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.userSelectfocus$)
      .merge(this.userSelectclick$.filter(() => !this.userSelectionInstance.isPopupOpen()))
      .map(term => (term === '' ? this.users : this.users.filter(v => v.email.toLowerCase().indexOf(term.toLowerCase()) > -1)));
  userFormatter = (x: { email: string, id: number }) => x.id + ' ' + x.email;

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
      //console.log(this.wizard);
      this.progressWidth1 = 0;
      this.progressWidth2 = 0;
      this.currentprogress = 0;
      this.isOn = true;
    }
  }
}
