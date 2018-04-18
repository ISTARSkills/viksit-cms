import { Component, OnInit, Input } from '@angular/core';
import { AppConfiguration } from '../app.constants';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
declare var require: any;
const swal = require('sweetalert2');
@Component({
  selector: 'app-partial-course-list-item',
  templateUrl: './partial-course-list-item.component.html',
  styleUrls: ['./partial-course-list-item.component.css']
})
export class PartialCourseListItemComponent implements OnInit {
  @Input() data: any;
  complex_object;
  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    const local_complex_object = localStorage.getItem('currentUser')

    this.complex_object = JSON.parse(local_complex_object);
    //console.log(this.data);
  }
  saveToDropbox(lesson) {
    swal("Functionality pending");
    /* const body = new HttpParams().set('course_object', JSON.stringify("{}"));
    this.http.post(AppConfiguration.ServerWithApiUrl + 'lesson/1/upload_to_google/' + lesson.id + '/' + this.complex_object.id, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    }).subscribe(res => {
      //console.log(res['data']);
      res['data'];
    }, error => {
      console.log('something went wrong');
    }); */
  }
}
