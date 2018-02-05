import { Component, OnInit, ViewChild } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper/dist/lib/dropzone.interfaces';
import { AppConfiguration } from '../app.constants';
import { WizardComponent } from 'ng2-archwizard';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http/';
import { Course } from '../pojo/course';
import { Module } from '../pojo/module/module';
import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';

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
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  public config: DropzoneConfigInterface = {
    url: AppConfiguration.ServerWithApiUrl + 'image/upload',
    method: 'POST',
    maxFiles: 1,
    clickable: true,
    createImageThumbnails: true,
    acceptedFiles: 'image/png',
    errorReset: null,
    cancelReset: null,
    addRemoveLinks: true
  };

  myOptions: INgxMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
  };

  // Initialized to specific date (09.10.2018)
  model: any = { date: { year: 2018, month: 10, day: 9 } };


  constructor(private http: HttpClient) { }

  // optional date changed callback
  onDateChanged(event: IMyDateModel): void {
    // date selected
  }

  ngOnInit() {

    var modules = Array();
    this.newCourse = new Course("", null, "", "", "", "", modules);
    const local_complex_object = localStorage.getItem('currentUser')

    this.complex_object = JSON.parse(local_complex_object);
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

  }

}
