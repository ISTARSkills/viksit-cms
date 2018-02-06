import {
  Component, OnInit, ViewChild, Input
} from '@angular/core';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Session } from '../pojo/session/session';
import { Lesson } from '../pojo/lesson/lesson';
import { Course } from '../pojo/course';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap/accordion/accordion';
import { Module } from '../pojo/module/module';
import { AppConfiguration } from './../app.constants';
import { DROPZONE_CONFIG, DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover/popover';

@Component({
  selector: 'app-course-builder-content-creator',
  templateUrl: './course-builder-content-creator.component.html',
  styleUrls: ['./course-builder-content-creator.component.css'],
})
export class CourseBuilderContentCreatorComponent implements OnInit {

  @ViewChild(ContextMenuComponent) public contextMenu: ContextMenuComponent;

  public contextMenuActions = [
    {
      html: (item) => `Insert Comment`,
      click: (item) => alert('clicked'),
      enabled: (item) => true,
      visible: (item) => item,
    }
  ];
  @Input() newCourse;
  formatdate = 'dd/MM/yyyy h:mm:ss a';
  pipe = new DatePipe('en-US');
  complex_object;
  id: string;
  course;
  comments;
  navbarIsVisible = false;
  closeResult: string;
  title = '';
  desc = '';
  type = '';
  item_id: number;
  item_type: string;
  modalName = "";
  simpleDrop: any = null;
  dragOperation = 'module';
  selectOperation = 'PRESENTATION';
  module_index;
  session_index;
  lesson_index;
  public isCollapsed = true;
  issuesList = [];
  commentValue;
  submitandreviewIsVisible = true;
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

  constructor(private route: ActivatedRoute, private http: HttpClient, private modalService: NgbModal, private contextMenuService: ContextMenuService) {
    this.id = this.route.snapshot.params.id;

  }


  public addModuleComponent = function (course) {
    var lessons = Array();
    var sessions = Array();
    var newLesson = new Lesson("New Lesson", "New Lesson Desc", 'INCOMPLETE', "", null, "PRESENTATION")
    lessons.push(newLesson);
    var newSession = new Session("New Session", "New Session Desc", 0, lessons, null)
    sessions.push(newSession);
    var newModule = new Module("New Module", "New Module Desc", 0, sessions, "", "INCOMPLETE", null)
    console.log("newModule " + JSON.stringify(newModule));

    if (this.course.modules != undefined) {
      this.course.modules.push(newModule);
    }
    console.log(this.course);
  };


  public removeModuleFunction = function (module) {
    var index = this.course.modules.indexOf(module);
    this.course.modules.splice(index, 1);
    console.log(this.course);
  };

  public addSessionComponent = function (module) {
    var index = this.course.modules.indexOf(module);
    var lessons = Array();
    var newLesson = new Lesson("New Lesson", "New Lesson Desc", "INCOMPLETE", "", null, "PRESENTATION")
    lessons.push(newLesson);
    var newSession = new Session("New Session", "NewSession Desc", 0, lessons, null)
    console.log("newSession " + JSON.stringify(newSession));
    this.course.modules[index].sessions.push(newSession);
    console.log(this.course);
  };

  public removeSessionsFunction = function (module, session) {
    var moduleIndex = this.course.modules.indexOf(module);
    var sessionIndex = this.course.modules[moduleIndex].sessions.indexOf(session);

    this.course.modules[moduleIndex].sessions.splice(sessionIndex, 1);
    console.log(this.course);
  };

  public addLessonsComponent = function (module, session) {
    var moduleIndex = this.course.modules.indexOf(module);
    var sessionIndex = this.course.modules[moduleIndex].sessions.indexOf(session);
    var newLesson = new Lesson("New Lesson", "New Lesson Desc", "INCOMPLETE", "", null, "PRESENTATION")
    console.log("newSession " + JSON.stringify(newLesson));
    this.course.modules[moduleIndex].sessions[sessionIndex].lessons.push(newLesson);
    console.log(this.course);
  };

  public removeLessonsFunction = function (module, session, lesson) {
    var moduleIndex = this.course.modules.indexOf(module);
    var sessionIndex = this.course.modules[moduleIndex].sessions.indexOf(session);
    var lessonIndex = this.course.modules[moduleIndex].sessions[sessionIndex].lessons.indexOf(lesson);
    this.course.modules[moduleIndex].sessions[sessionIndex].lessons.splice(lessonIndex, 1);
    console.log(this.course);
  };


  public open(type, value, content, module_index, session_index, lesson_index) {
    this.modalName = 'Edit ' + type;
    this.type = type;
    this.title = value.name;
    this.item_id = value.id;
    this.item_type = type;
    this.desc = value.description;
    this.module_index = module_index;
    this.session_index = session_index;
    this.lesson_index = lesson_index;
    console.log(this.item_id);
    console.log(this.item_type);
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public save(content) {

    console.log(this.type.toLowerCase());
    switch (this.type.toLowerCase()) {
      case 'course':
        this.course.name = this.title;
        this.course.description = this.desc;
        break;
      case 'module':
        this.course.modules[this.module_index].name = this.title;
        this.course.modules[this.module_index].description = this.desc;
        break;
      case 'session':
        this.course.modules[this.module_index].sessions[this.session_index].name = this.title;
        this.course.modules[this.module_index].sessions[this.session_index].description = this.desc;
        break;
      case 'lesson':
        this.course.modules[this.module_index].sessions[this.session_index].lessons[this.lesson_index].name = this.title;
        this.course.modules[this.module_index].sessions[this.session_index].lessons[this.lesson_index].description = this.desc;
        this.course.modules[this.module_index].sessions[this.session_index].lessons[this.lesson_index].type = this.selectOperation;
        break;

    }
    console.log(this.course);

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
  onUploadSuccess(file) {

    console.log(file);
    console.log(file[0].upload.filename);
    console.log(file[0].type);

  }


  onUploadError(file) {

    console.log(file);
    console.log(file[0].upload.filename);
    console.log(file[0].type);
  }
  ngOnInit() {


    if (this.newCourse != undefined) {
      console.log("newCourse >>> " + this.newCourse.name);
      this.course = this.newCourse;
      this.submitandreviewIsVisible = false;
    }
    console.log("id >>> " + this.id);
    const now = Date.now() - 1;
    const myFormattedDate = this.pipe.transform(now, this.formatdate);
    const local_complex_object = localStorage.getItem('currentUser')

    this.complex_object = JSON.parse(local_complex_object);
  

    if (this.id != undefined) {
      this.navbarIsVisible = true;
      // Make the HTTP request:
      this.http.get(AppConfiguration.ServerWithApiUrl + 'course/1/course_structure/' + this.id).subscribe(data => {
        // Read the result field from the JSON response.
        this.course = data['data'];
        console.log(this.course);
        for (let issue of this.course.issues) {
          for (let comments of issue.comments) {
            this.issuesList.push(comments);
          }

        }
        console.log(this.issuesList);
      });

    }





  }

  saveEndExitClicked() {
    console.log('save called>>');
    const body = new HttpParams().set('course_object', JSON.stringify(this.course));
    this.http.post(AppConfiguration.ServerWithApiUrl + 'course/1/edit_course_structure/' + this.complex_object.id + '/' + this.id, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    }).subscribe(res => console.log(res));

  }


  keyDownFunction(event) {

    console.log(this.commentValue);
    if (event.keyCode == 13) {
      console.log(event);
      this.issuesList.push({
        imageURL: this.complex_object.studentProfile.profileImage,
        name: this.complex_object.studentProfile.firstName,
        comment: this.commentValue,
        date: new Date()
      });
      this.commentValue = null;
    }

    console.log(this.complex_object.studentProfile.profileImage);
    console.log(this.complex_object.studentProfile.firstName);
  }

  offset(el) {
    var rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
  }

}
