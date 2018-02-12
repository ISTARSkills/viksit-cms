import { Injectable } from '@angular/core';
import { AppConfiguration } from '../../app.constants';
import { Course } from '../../pojo/course';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
@Injectable()
export class CourseBuilderServiceService {

  course: Course;
  issuesList = [];
  constructor(private http: HttpClient) { }


  public getCourseStructure(id: string) {

    // Make the HTTP request:
    this.http.get(AppConfiguration.ServerWithApiUrl + 'course/1/course_structure/' + id).subscribe(data => {
      // Read the result field from the JSON response.
      this.course = data['data'];
      console.log("this is in service");
      console.log(this.course);
      for (let issue of this.course.issues) {
        for (let comments of issue.comments) {
          this.issuesList.push(comments);
        }

      }
      //console.log(this.issuesList);
    });
    return this.course;
  }


}
