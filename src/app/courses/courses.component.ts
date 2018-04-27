import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { AppConfiguration } from '../app.constants';
import 'rxjs/add/operator/takeUntil';
import { NgbModal, ModalDismissReasons, NgbModalOptions, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';
import { Lesson } from '../pojo/lesson/lesson';
declare var require: any;
const swal = require('sweetalert2');

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  complex_object;
  courses: any;
  storedCourses;
  closeResult: string;
  selectedModal;
  selectedCourseModal;
  currentModalInstance: any;
  changeIcon = true;
  iconIndex: any = 0;
  public loading = false;
  userType: string;
  options: NgbModalOptions = {
    size: 'lg',
    windowClass: 'animated bounceInUp',
  };
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private modalService: NgbModal) { }

  ngOnInit() {
    const local_complex_object = localStorage.getItem('currentUser')

    this.complex_object = JSON.parse(local_complex_object);
    this.userType = this.complex_object.studentProfile.userType;
    this.loading = true;
    this.http.get(AppConfiguration.ServerWithApiUrl + 'course/1/get_all_course_structure/' + this.complex_object.id).takeUntil(this.ngUnsubscribe).subscribe(data => {
      // Read the result field from the JSON response.
      //console.log('---> ' + data['data'][0]);
      this.courses = data['data'];
      this.storedCourses = data['data'];
      this.loading = false;
    }, err => {
      this.loading = false;
      swal('Something went wrong!');

    });
  }
  open(content, s: string, course: any) {
    //console.log('Called' + s);
    this.selectedModal = s;
    this.selectedCourseModal = course;
    this.currentModalInstance = this.modalService.open(content, this.options);
    this.currentModalInstance.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  ignore(event: Event) {
    //event.preventDefault();
    event.stopPropagation();
  }
  courseStatusChanged($event, course) {

    //console.log($event);
    //console.log(course);
    var action = "";
    if ($event) {
      action = "publish";
    } else {
      action = "production";
    }
    swal({
      title: 'Are you sure?',
      text: "You want to change the status of course?",
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
        this.loading = true;
        const body = new HttpParams().set('course_object', JSON.stringify(course));
        this.http.post(AppConfiguration.ServerWithApiUrl + 'course/1/publish_course/' + course.id + '/' + action, body, {
          headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
        }).takeUntil(this.ngUnsubscribe).subscribe(res => {
          //console.log(res['data']);
          course = res['data'];
          this.loading = false;
        }, error => {
          swal('Something went wrong');
        });
        swal(
          'Done',
          'Course status changed successfully',
          'success'
        )
      } else if (
        // Read more about handling dismissals
        result.dismiss === swal.DismissReason.cancel
      ) {
        /* swal(
          'Cancelled',
          'Request has been cancelled',
          'error'
        ) */
        //this.courses = this.courses
      }
      //window.location.reload();
    })


  }

  searchTask(s: string) {
    //console.log('---> ' + s);
    this.courses = this.storedCourses;
    if (s.trim() == "") {
      //console.log('its empty');
      this.courses = this.storedCourses;
    } else {
      var re = s.toLowerCase().trim();
      this.courses = this.storedCourses.filter((item: any) => {
        if (item.name.toLowerCase().trim().indexOf(re) > -1) {
          return true;
        } else {
          for (let module of item.modules) {
            if (module.name.toLowerCase().trim().indexOf(re) > -1) {
              return true;
            } else {
              for (let session of module.sessions) {
                if (session.name.toLowerCase().trim().indexOf(re) > -1) {
                  return true;
                } else {
                  let lessonArray = new Array<Lesson>();
                  for (let lesson of session.lessons) {
                    if (lesson.name.toLowerCase().trim().indexOf(re) > -1) {
                      lessonArray.push(lesson);
                      return true;
                    }
                  }
                }
              }
            }
          }
        }
      });
      //console.log(this.courses.length + '   ' + this.storedCourses.length)
    }
  }
  updateCourseStructure(updatedCourses) {
    //console.log('getting callback at parent -------')
    this.currentModalInstance.close();
    this.courses = updatedCourses;
    this.storedCourses = updatedCourses;
    this.loading = false;
  }
  updateLoader($event) {
    this.loading = $event;
  }
  public accordionChange($event: NgbPanelChangeEvent) {
    var getIndex = ($event.panelId).split("-")[1];
    this.iconIndex = getIndex;
    if ($event.nextState === true) {
      this.changeIcon = false;
    } else {
      this.changeIcon = true;
    }
  }
  redirectToAssignPage(course) {
    var courseTaskId = course.taskId;
    this.router.navigate(['../review_task/' + courseTaskId], { relativeTo: this.route });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log("unsubscribe");
  }
}