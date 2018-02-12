import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfiguration } from '../../app.constants';
import { Slide } from '../../pojo/slide/slide';
import { Paragraph } from '../../pojo/slide/paragraph';
import { Title } from '../../pojo/slide/title';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Lesson } from '../../pojo/lesson/lesson';

@Injectable()
export class LessonBuilderServiceService {
  //lesson: any;
  slide: Slide;
  newTitle: Title;
  newParagraph: Paragraph;

  public lesson = new BehaviorSubject<Object>(null);
  currentLesson = this.lesson.asObservable();

  constructor(private http: HttpClient) { }
  public getlessonDetails(id) {
    sessionStorage.removeItem('lesson');
    return this.http.get(AppConfiguration.ServerWithApiUrl + 'lesson/1/get_lesson_structure/' + id);
  }

  public lessonSave(data) {
    this.lesson.next(data);

    sessionStorage.setItem('lesson', JSON.stringify(data));
  }

  public getSlide(id): Observable<any> {
    var slideExist = false;
    const sessionLesson = sessionStorage.getItem('lesson')
    var currentlesson = JSON.parse(sessionLesson);
    for (let stage of currentlesson.stages) {

      for (let slide of stage.slides) {

        if (slide.id === id) {
          slideExist = true;
          console.log(slide)
          return Observable.of(slide)
        }
      }
    }
    return Observable.of(currentlesson);
  }

  public getAllSlide(): Observable<any> {
    var slides = [];
    const sessionLesson = sessionStorage.getItem('lesson')
    var currentlesson = JSON.parse(sessionLesson);
    return Observable.of(currentlesson);

  }

}
