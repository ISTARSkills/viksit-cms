import { Component, OnInit, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper/dist/lib/dropzone.interfaces';
import { AppConfiguration } from '../app.constants';
import { WizardComponent } from 'ng2-archwizard';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http/';
import { Course } from '../pojo/course';
import { Module } from '../pojo/module/module';
import { INgxMyDpOptions, IMyDateModel, IMyDate } from 'ngx-mydatepicker';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-course-task',
  templateUrl: './create-course-task.component.html',
  styleUrls: ['./create-course-task.component.css']
})
export class CreateCourseTaskComponent implements OnInit {

  complex_object;
  progress = 50;
  isOn = true;
  isDisabled = false;
  currentprogress = 0;
  progressWidth1 = 0;
  newCourse: Course;
  progressWidth2 = 0;
  isInclude2ndStep = false;
  users = [];
  courseImage = "";
  item_id;
  item_type = "COURSE_CREATION_TASK";
  selectedUser = null;
  @ViewChild('userSelectionInstance') userSelectionInstance: NgbTypeahead;
  userSelectfocus$ = new Subject<string>();
  userSelectclick$ = new Subject<string>();
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
  public loading = false;
  public config: DropzoneConfigInterface = {
    url: AppConfiguration.ServerWithApiUrl + 'image/upload',
    method: 'POST',
    maxFiles: 1,
    clickable: true,
    createImageThumbnails: true,
    acceptedFiles: 'image/png',
    errorReset: null,
    cancelReset: null,
    addRemoveLinks: true,
    dictDefaultMessage: 'Upload Image',
    params: { 'item_type': this.item_type },
    init: function () {

    }
  };
  myOptions: INgxMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: false,
    showSelectorArrow: false,
    closeSelectorOnDocumentClick: false
  };

  // Initialized to specific date (09.10.2018)
  model: any = { date: { day: new Date().getDate(), month: new Date().getMonth() + 1, year: new Date().getFullYear() } };



  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) { }

  onDateChanged(event: IMyDateModel): void {
  }


  userSearch = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.userSelectfocus$)
      .merge(this.userSelectclick$.filter(() => !this.userSelectionInstance.isPopupOpen()))
      .map(term => (term === '' ? this.users : this.users.filter(v => v.email.toLowerCase().indexOf(term.toLowerCase()) > -1)));
  userFormatter = (x: { email: string, id: number }) => x.id + ' ' + x.email;


  onUploadSuccess(file) {

    // console.log(file);
    console.log(file[0].upload.filename);
    console.log(file[0].type);
    this.courseImage = file[0].xhr.response

    this.newCourse.imageURL = this.courseImage;
  }


  onUploadError(file) {

    console.log(file);
    console.log(file[0].upload.filename);
    console.log(file[0].type);
  }

  ngOnInit() {

    var modules = Array();
    this.newCourse = new Course("", null, "", "", "", "", modules);
    const local_complex_object = localStorage.getItem('currentUser')

    this.complex_object = JSON.parse(local_complex_object);

    var types = { "userType": "CONTENT_CREATOR,CONTENT_ADMIN" };
    const body = new HttpParams().set('type', JSON.stringify(types));
    this.http.post(AppConfiguration.ServerWithApiUrl + 'user/user_bytype', body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    }).subscribe(data => {
      // Read the result field from the JSON response.
      this.users = data['data'];
      console.log(this.users);
    });
  }

  isValidForm() {
    var isValid = false
    if (this.newCourse.name.trim() != '' && this.newCourse.description.trim() != '') {
      isValid = true;
    } else {
      isValid = false;
    }
    return isValid;
  }

  enterSecondStep($event) {

    if (this.wizard != undefined) {
      console.log(">>> " + this.wizard.model.currentStepIndex);
      this.currentprogress = this.wizard.model.currentStepIndex;
      if (this.wizard.model.currentStepIndex == 0) {
        this.progressWidth1 = 0;
        this.progressWidth2 = 0;
        this.isOn = true;
      }
      if (this.wizard.model.currentStepIndex == 1) {


        this.isInclude2ndStep = true;
        console.log("this.newCourse >>> " + this.newCourse.name);
        this.progressWidth1 = 50;
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

  }





  finishFunction() {

    console.log(this.newCourse);
    console.log(this.selectedUser);
    console.log(this.model.formatted);
    let dueDate = "";
    if (this.selectedUser != null && this.selectedUser != undefined && this.selectedUser != '' && this.model != null) {

      if (this.model.formatted != undefined) {
        dueDate = this.model.formatted;
      } else {
        dueDate = this.model.date.day + "/" + this.model.date.month + "/" + this.model.date.year;
      }

      var assignee_object = {
        "userAssingedTo": [this.selectedUser.id],
        "dueDate": dueDate
      };
      this.loading = true;
      const body = new HttpParams().set('course_object', JSON.stringify(this.newCourse)).set('assignee_object', JSON.stringify(assignee_object));
      this.http.post(AppConfiguration.ServerWithApiUrl + 'course/1/create_course_task/' + this.complex_object.id, body, {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      }).subscribe(res => {
        console.log(res['data']);
        this.loading = false;
        this.router.navigate(['/dashboard'], { relativeTo: this.route });
      });
    } else {

      alert("Please Assign The Task to a User");


    }



  }

}
