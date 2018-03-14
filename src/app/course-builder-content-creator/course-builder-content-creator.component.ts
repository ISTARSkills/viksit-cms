import {
  Component, OnInit, ViewChild, Input
} from '@angular/core';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Session } from '../pojo/session/session';
import { Lesson } from '../pojo/lesson/lesson';
import { Course } from '../pojo/course';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap/accordion/accordion';
import { Module } from '../pojo/module/module';
import { AppConfiguration } from './../app.constants';
import { DROPZONE_CONFIG, DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover/popover';
import { CourseBuilderServiceService } from '../services/course_builder/course-builder-service.service';
import { Subject } from 'rxjs/Subject';
declare var require: any;
const swal = require('sweetalert2');

@Component({
  selector: 'app-course-builder-content-creator',
  templateUrl: './course-builder-content-creator.component.html',
  styleUrls: ['./course-builder-content-creator.component.css'],
})
export class CourseBuilderContentCreatorComponent implements OnInit {

  @ViewChild(ContextMenuComponent) public contextMenu: ContextMenuComponent;
  @ViewChild('itemType') itemType;
  @ViewChild('jumbotron') jumbotron;
  public contextMenuActions = [
    {
      html: (item) => `Insert Comment`,
      click: (item) => alert('clicked'),
      enabled: (item) => true,
      visible: (item) => item,
    }
  ];
  @Input() newCourse;
  pipe = new DatePipe('en-US');
  complex_object;
  id: string;
  course: Course;
  courseImage = "";
  moduleImage = "";
  lessonImage = "";
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
  selectlessonType = 'PRESENTATION';
  module_index;
  session_index;
  lesson_index;
  public isCollapsed = true;
  issuesList = [];
  commentValue;
  isSubmitTrue = false;
  submitandreviewIsVisible = true;
  idNew = false;
  currentModalInstance: any;
  public loading = false;
  options: NgbModalOptions = {
    size: 'lg',
    windowClass: 'animated bounceInUp',
    backdrop: 'static'
  };
  public config: DropzoneConfigInterface = {
    url: AppConfiguration.ServerWithApiUrl + 'image/upload',
    method: 'POST',
    maxFiles: 1,
    clickable: true,
    maxFilesize: 1,
    createImageThumbnails: true,
    acceptedFiles: 'image/png',
    errorReset: null,
    cancelReset: null,
    addRemoveLinks: true,
    dictDefaultMessage: 'Upload Image',
    init: function () {
      this.on("removedfile", function (file) {
      });
    }
  };

  imageChangedEvent: any = '';
  croppedImage: any = '';
  disableUpload = false;
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.disableUpload = false;
    console.log(event);
  }
  imageCropped(image: string) {
    this.croppedImage = image;
    this.disableUpload = false;
  }
  imageLoaded() {
    console.log(this.item_type);
    // show cropper
  }
  loadImageFailed() {
    swal('Something went wrong. Try again!!');
    // show message
  }

  uploadImage() {
    var arr = this.croppedImage.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    var blob = new Blob([u8arr], { type: mime });
    var fd = new FormData(document.forms[0]);
    fd.append("item_type", this.item_type);
    fd.append("file", blob, this.imageChangedEvent.target.files[0]['name'].replace(/\s/g, '_'));
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.set('Accept', 'application/json');
    this.loading = true;
    this.http.post(AppConfiguration.ServerWithApiUrl + 'image/upload', fd, {
      headers: headers,
      responseType: 'text'
    }).subscribe(
      res => {
        console.log(res)
        this.loading = false;
        this.disableUpload = true;
        if (this.type.toLowerCase() === 'course') {
          this.courseImage = res;
        } else if (this.type.toLowerCase() === 'module') {
          this.moduleImage = res;
        } else if (this.type.toLowerCase() === 'lesson') {
          this.lessonImage = res;
        }
      }, error => {
        this.loading = false;
        swal('Something went wrong. Try again!!');
        this.disableUpload = false;
      }

    );
  }

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private modalService: NgbModal, private contextMenuService: ContextMenuService, private courseBuilderServive: CourseBuilderServiceService) {
    this.id = this.route.snapshot.params.id;

  }

  isValidForm() {
    var isValid = false
    if (this.title.trim() != '' && this.desc.trim() != '') {
      isValid = true;
    } else {
      isValid = false;
    }
    return isValid;
  }


  public addModuleComponent = function (course, content) {
    this.imageChangedEvent = null;
    this.croppedImage = null;
    this.idNew = true;
    this.title = "";
    this.desc = "";
    this.modalName = "Create " + "Module";
    this.type = "Module";
    this.item_type = this.type;
    this.currentModalInstance = this.modalService.open(content, this.options);
    this.currentModalInstance.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  };


  public removeModuleFunction = function (module) {

    //console.log(this.course);
    swal({
      title: 'Are you sure?',
      text: "Do you want to delete this module?",
      type: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonClass: 'btn btn-success ml-2',
      cancelButtonClass: 'btn btn-danger mr-2',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        var index = this.course.modules.indexOf(module);
        this.course.modules.splice(index, 1);
        swal(
          'Done',
          'Module deleted successfully',
          'success'
        )
      } else if (
        // Read more about handling dismissals
        result.dismiss === swal.DismissReason.cancel
      ) {
        swal(
          'Cancelled',
          'Your module is safe!',
          'error'
        )
      }
    })
  };

  public addSessionComponent = function (module, content) {

    this.module_index = this.course.modules.indexOf(module);
    this.idNew = true;
    this.title = "";
    this.desc = "";
    this.modalName = "Create " + "Session";
    this.type = "Session";
    this.item_type = this.type;
    this.currentModalInstance = this.modalService.open(content, this.options);
    this.currentModalInstance.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  };

  public removeSessionsFunction = function (module, session) {
    swal({
      title: 'Are you sure?',
      text: "Do you want to delete this session?",
      type: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonClass: 'btn btn-success ml-2',
      cancelButtonClass: 'btn btn-danger mr-2',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        var moduleIndex = this.course.modules.indexOf(module);
        var sessionIndex = this.course.modules[moduleIndex].sessions.indexOf(session);
        this.course.modules[moduleIndex].sessions.splice(sessionIndex, 1);
        swal(
          'Done',
          'Session deleted successfully',
          'success'
        )
      } else if (
        // Read more about handling dismissals
        result.dismiss === swal.DismissReason.cancel
      ) {
        swal(
          'Cancelled',
          'Your session is safe!',
          'error'
        )
      }
    })
    //console.log(this.course);
  };

  public addLessonsComponent = function (module, session, content) {
    this.imageChangedEvent = null;
    this.croppedImage = null;
    this.module_index = this.course.modules.indexOf(module);
    this.session_index = this.course.modules[this.module_index].sessions.indexOf(session);

    this.idNew = true;
    this.title = "";
    this.desc = "";
    this.modalName = "Create " + "Lesson";
    this.type = "Lesson";
    this.item_type = this.type;
    this.currentModalInstance = this.modalService.open(content, this.options);
    this.currentModalInstance.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  };

  public removeLessonsFunction = function (module, session, lesson) {
    swal({
      title: 'Are you sure?',
      text: "Do you want to delete this lesson?",
      type: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonClass: 'btn btn-success ml-2',
      cancelButtonClass: 'btn btn-danger mr-2',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        var moduleIndex = this.course.modules.indexOf(module);
        var sessionIndex = this.course.modules[moduleIndex].sessions.indexOf(session);
        var lessonIndex = this.course.modules[moduleIndex].sessions[sessionIndex].lessons.indexOf(lesson);
        this.course.modules[moduleIndex].sessions[sessionIndex].lessons.splice(lessonIndex, 1);
        swal(
          'Done',
          'Lesson deleted successfully',
          'success'
        )
      } else if (
        // Read more about handling dismissals
        result.dismiss === swal.DismissReason.cancel
      ) {
        swal(
          'Cancelled',
          'Your lesson is safe!',
          'error'
        )
      }
    })
    //console.log(this.course);
  };

  public moveToLessonsFunction = function (module, session, lesson) {

  }


  public open(type, value, content, module_index, session_index, lesson_index) {
    this.imageChangedEvent = null;
    this.croppedImage = null;
    //console.log(type);
    this.modalName = 'Edit ' + type;
    this.idNew = false;
    this.type = type;
    this.title = value.name;
    this.item_id = value.id;
    this.item_type = type;
    this.croppedImage = null;
    if (this.type.toLowerCase() === 'course' && value.imageURL != '') {
      this.croppedImage = value.imageURL;
      this.disableUpload = true;
    } else if (this.type.toLowerCase() === 'module' && value.imageURL != '') {
      this.croppedImage = value.imageURL;
      this.disableUpload = true;
    } else if (this.type.toLowerCase() === 'lesson' && value.imageURL != '') {
      this.croppedImage = value.imageURL;
      this.disableUpload = true;
    }
    this.desc = value.description;
    this.module_index = module_index;
    this.session_index = session_index;
    this.lesson_index = lesson_index;
    //console.log(this.item_id);
    //console.log(this.item_type);
    this.currentModalInstance = this.modalService.open(content, this.options);
    this.currentModalInstance.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public save(content) {

    //console.log(this.type.toLowerCase());
    switch (this.type.toLowerCase()) {
      case 'course':
        this.course.name = this.title;
        this.course.description = this.desc;
        this.course.imageURL = this.courseImage;
        break;
      case 'module':

        if (this.idNew) {

          var sessions = Array();
          var newModule = new Module(this.title, this.desc, 0, sessions, this.moduleImage, "INCOMPLETE", null)
          this.course.modules.push(newModule);
        } else {
          this.course.modules[this.module_index].name = this.title;
          this.course.modules[this.module_index].description = this.desc;
          this.course.modules[this.module_index].imageURL = this.moduleImage;
        }


        break;
      case 'session':
        if (this.idNew) {
          var lessons = Array();
          var newSession = new Session(this.title, this.desc, 0, lessons, null);
          this.course.modules[this.module_index].sessions.push(newSession);
        } else {
          this.course.modules[this.module_index].sessions[this.session_index].name = this.title;
          this.course.modules[this.module_index].sessions[this.session_index].description = this.desc;
        }




        break;
      case 'lesson':

        if (this.idNew) {
          var newLesson = new Lesson(this.title, this.desc, "INCOMPLETE", this.lessonImage, null, this.selectlessonType)
          this.course.modules[this.module_index].sessions[this.session_index].lessons.push(newLesson);
        } else {
          this.course.modules[this.module_index].sessions[this.session_index].lessons[this.lesson_index].name = this.title;
          this.course.modules[this.module_index].sessions[this.session_index].lessons[this.lesson_index].description = this.desc;
          this.course.modules[this.module_index].sessions[this.session_index].lessons[this.lesson_index].type = this.selectlessonType;
          this.course.modules[this.module_index].sessions[this.session_index].lessons[this.lesson_index].imageURL = this.lessonImage;

        }
        break;

    }
    //console.log(this.course);
    this.currentModalInstance.close();
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

    // console.log(file);
    //console.log(file[0].upload.filename);
    //console.log(file[0].type);
    //console.log(file[0].xhr.response);
    if (this.type.toLowerCase() === 'course') {
      this.courseImage = file[0].xhr.response
    } else if (this.type.toLowerCase() === 'module') {
      this.moduleImage = file[0].xhr.response

    } else if (this.type.toLowerCase() === 'lesson') {
      this.lessonImage = file[0].xhr.response

    }

  }


  onUploadError(file) {

    // console.log(file);
    // console.log(file[0].upload.filename);
    // console.log(file[0].type);
  }
  ngOnInit() {


    if (this.newCourse != undefined) {

      this.jumbotron.nativeElement.classList.remove("jumbotron");
      this.navbarIsVisible = false;
      //console.log("newCourse >>> " + this.newCourse.name);
      this.course = this.newCourse;
      this.submitandreviewIsVisible = false;
    }
    //console.log("id >>> " + this.id);
    const local_complex_object = localStorage.getItem('currentUser')

    this.complex_object = JSON.parse(local_complex_object);


    if (this.id != undefined) {
      this.navbarIsVisible = true;


      this.loading = true;
      // Make the HTTP request:
      this.http.get(AppConfiguration.ServerWithApiUrl + 'course/1/course_structure/' + this.id).subscribe(data => {
        // Read the result field from the JSON response.
        this.course = data['data'];
        //console.log(this.course);
        for (let issue of this.course.issues) {
          for (let comments of issue.comments) {
            this.issuesList.push(comments);
          }

        }
        //console.log(this.issuesList);
        this.loading = false;
      });

    }

  }

  dragOperationFunction(operation) {

    this.dragOperation = operation;

  }

  submitForReviewdClicked() {
    //console.log('review called>>');
    this.loading = true;
    // Make the HTTP request:
    this.http.get(AppConfiguration.ServerWithApiUrl + 'course/1/send_course_structure_review/' + this.id).subscribe(data => {
      // Read the result field from the JSON response.
      this.loading = false;
      this.router.navigate(['../../dashboard'], { relativeTo: this.route });
    });

  }

  saveEndExitClicked() {
    //console.log('save called>>');
    this.loading = true;
    const body = new HttpParams().set('course_object', JSON.stringify(this.course));
    this.http.post(AppConfiguration.ServerWithApiUrl + 'course/1/edit_course_structure/' + this.complex_object.id + '/' + this.id, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    }).subscribe(res => {
      //console.log(res)
      this.course = res['data'];
      this.isSubmitTrue = true;
      this.loading = false;
    });

  }

  saveVisible(modules) {

    if (modules != null && modules.length != 0) {

      for (let module of modules) {

        if (module.sessions != null && module.sessions.length != 0) {

          for (let session of module.sessions) {

            if (session.lessons != null && session.lessons.length != 0) {

              return false;

            } else {
              return true;
            }

          }
        } else {
          return true;
        }

      }



    } else {
      return true;
    }

  }


  keyDownFunction(event) {

    //console.log(this.commentValue);
    if (event.keyCode == 13) {
      //console.log(event);
      this.issuesList.push({
        imageURL: this.complex_object.studentProfile.profileImage,
        name: this.complex_object.studentProfile.firstName,
        comment: this.commentValue,
        date: new Date()
      });
      this.commentValue = null;
    }

    //console.log(this.complex_object.studentProfile.profileImage);
    //console.log(this.complex_object.studentProfile.firstName);
  }

  offset(el) {
    var rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
  }

}
