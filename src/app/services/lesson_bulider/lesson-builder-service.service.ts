import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfiguration } from '../../app.constants';
import { Slide } from '../../pojo/slide/slide';
import { Paragraph } from '../../pojo/slide/paragraph';
import { Title } from '../../pojo/slide/title';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Lesson } from '../../pojo/lesson/lesson';
import { Skill } from '../../pojo/skill/skill';

@Injectable()
export class LessonBuilderServiceService {
  //lesson: any;
  slide: Slide;
  newTitle: Title;
  newParagraph: Paragraph;
  SkillList;
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


  public getSkillForQuestions(term: string = null): Observable<Skill[]> {

    let items = this.SkillList;
    if (term != null) {
      items = items.filter(x => x.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
    }
    return Observable.of(items).delay(500);
  }

  getSkill() {

    this.http.get(AppConfiguration.ServerWithApiUrl + 'lesson/1/get_learning_objectives/').subscribe(
      data => {
        console.log("skills");
        this.SkillList = data['data']
        console.log(this.SkillList);
      },
      err => {
        console.log('Something went wrong!');
      }
    );

  }


}
