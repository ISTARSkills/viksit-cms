import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { AppConfiguration } from '../app.constants';
import { Session } from 'selenium-webdriver';
import { Lesson } from '../pojo/lesson/lesson';
import { Module } from '../pojo/module/module';
import { NgbModal, ModalDismissReasons, NgbModalOptions, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private route: ActivatedRoute, private http: HttpClient, private modalService: NgbModal) { }

  ngOnInit() {
    const local_complex_object = localStorage.getItem('currentUser')

    this.complex_object = JSON.parse(local_complex_object);
    this.userType = this.complex_object.studentProfile.userType;
    this.loading = true;
    this.http.get(AppConfiguration.ServerWithApiUrl + 'course/1/get_all_course_structure/' + this.complex_object.id).subscribe(data => {
      // Read the result field from the JSON response.
      //console.log('---> ' + data['data'][0]);
      this.courses = data['data'];
      this.storedCourses = data['data'];
      this.loading = false;
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
  onSelectionChange(course) {

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
}
