import { Component, OnInit } from '@angular/core';
import { Lesson } from '../pojo/lesson/lesson';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfiguration } from '../app.constants';
import { LessonBuilderServiceService } from '../services/lesson_bulider/lesson-builder-service.service';
import { Title } from '../pojo/slide/title';
import { Paragraph } from '../pojo/slide/paragraph';
import { Slide } from '../pojo/slide/slide';

@Component({
  selector: 'app-lesson-builder-content-creator',
  templateUrl: './lesson-builder-content-creator.component.html',
  styleUrls: ['./lesson-builder-content-creator.component.css']
})
export class LessonBuilderContentCreatorComponent implements OnInit {
  lesson: any;
  id
  complex_object;
  public isCollapsed = true;
  constructor(private route: ActivatedRoute, private http: HttpClient, private lessonBuilderService: LessonBuilderServiceService) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit() {

    const local_complex_object = localStorage.getItem('currentUser')

    this.complex_object = JSON.parse(local_complex_object);
    console.log(">>>> " + this.complex_object.studentProfile.firstName);


    if (this.id != undefined) {



      const req = this.lessonBuilderService.getlessonDetails(this.id);
      req.subscribe(
        data => {
          this.lessonBuilderService.lessonSave(data['data'])
          this.lessonBuilderService.currentLesson.subscribe(lesson => this.lesson = lesson)
          console.log("lesson");
          console.log(this.lesson);
        },
        err => {
          console.log('Something went wrong!');
        }
      );

    }

  }

  public addStageComponent(lesson) {
    var stage = {

      name: "New Stage",
      slides: []
    }
    this.lesson.stages.push(stage);
    console.log(this.lesson);
    sessionStorage.setItem('lesson', JSON.stringify(this.lesson));
  }

  public removeStageFunction = function (stage) {
    var index = this.lesson.stages.indexOf(stage);
    this.lesson.stages.splice(index, 1);
    sessionStorage.setItem('lesson', JSON.stringify(this.lesson));
  };

  public removeSlideFunction(stage, slide) {

    var stageIndex = this.lesson.stages.indexOf(stage);
    var slideIndex = this.lesson.stages[stageIndex].slides.indexOf(slide);
    this.lesson.stages[stageIndex].slides.splice(slideIndex, 1);
    sessionStorage.setItem('lesson', JSON.stringify(this.lesson));
  };

  public addSlideComponent = function (stage) {
    var index = this.lesson.stages.indexOf(stage);
    this.newTitle = new Title("", 1, "", 5)
    this.newParagraph = new Paragraph("", 2, "", 5)
    this.slide = new Slide(this.newTitle, this.newParagraph, "", "", "", "", null, 0);

    this.lesson.stages[index].slides.push(this.slide);
    console.log(this.lesson)
    sessionStorage.setItem('lesson', JSON.stringify(this.lesson));
  };

}
