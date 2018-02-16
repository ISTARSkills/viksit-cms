import { Component, OnInit } from '@angular/core';
import { Lesson } from '../pojo/lesson/lesson';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfiguration } from '../app.constants';
import { LessonBuilderServiceService } from '../services/lesson_bulider/lesson-builder-service.service';
import { Title } from '../pojo/slide/title';
import { Paragraph } from '../pojo/slide/paragraph';
import { Slide } from '../pojo/slide/slide';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lesson-builder-content-creator',
  templateUrl: './lesson-builder-content-creator.component.html',
  styleUrls: ['./lesson-builder-content-creator.component.css']
})
export class LessonBuilderContentCreatorComponent implements OnInit {
  lesson: any;
  id
  complex_object;
  public loading = false;
  public isCollapsed = true;
  currentModalInstance: any;
  closeResult: string;
  stageindex
  newTitle: Title;
  newParagraph: Paragraph
  slide: Slide
  selectSlideType = "ONLY_TITLE_PARAGRAPH_NEW";
  options: NgbModalOptions = {
    size: 'lg',
    windowClass: 'animated bounceInUp',
  };
  constructor(private modalService: NgbModal, private route: ActivatedRoute, private http: HttpClient, private lessonBuilderService: LessonBuilderServiceService) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit() {

    const local_complex_object = localStorage.getItem('currentUser')

    this.complex_object = JSON.parse(local_complex_object);
    console.log(">>>> " + this.complex_object.studentProfile.firstName);


    if (this.id != undefined) {
      this.loading = true;
      const req = this.lessonBuilderService.getlessonDetails(this.id);
      req.subscribe(
        data => {
          this.lessonBuilderService.lessonSave(data['data'])
          this.lessonBuilderService.currentLesson.subscribe(lesson => this.lesson = lesson)
          console.log("lesson");
          console.log(this.lesson);
          this.loading = false;
        },
        err => {
          console.log('Something went wrong!');
        }
      );

    }

  }

  public getFragmentCount(type) {

    switch (type) {
      case 'ONLY_TITLE_PARAGRAPH_NEW':
        return 1;
      default:
        return 0;
    }

  }

  public save(content) {

    this.newTitle = new Title("", 1, "", 500)
    this.newParagraph = new Paragraph("", 2, "", 500)
    this.slide = new Slide(this.newTitle, this.newParagraph, "", "", "", this.selectSlideType, null, this.getFragmentCount(this.selectSlideType), this.lesson.stages.length, "");
    this.lesson.stages[this.stageindex].slides.push(this.slide);
    console.log(this.lesson)
    sessionStorage.setItem('lesson', JSON.stringify(this.lesson));
    this.currentModalInstance.close();
  }

  saveEndExitClicked() {

    this.loading = true;
    console.log('save called>>');
    const body = new HttpParams().set('lesson_object', JSON.stringify(this.lesson));
    this.http.post(AppConfiguration.ServerWithApiUrl + 'lesson/1/save_slides/' + this.lesson.id, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    }).subscribe(res => {
      console.log(res)
      this.lesson = res['data']
      this.lessonBuilderService.lessonSave(res['data'])
      this.loading = false;
    });

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

  public addSlideComponent = function (stage, content) {

    this.modalName = "Create " + "Slide";
    this.type = "PRESENTATION";
    this.stageindex = this.lesson.stages.indexOf(stage);
    this.currentModalInstance = this.modalService.open(content, this.options);
    this.currentModalInstance.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  };


  private getDismissReason(reason: any): string {
    //
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public open(content) {

    this.currentModalInstance = this.modalService.open(content, this.options);
    this.currentModalInstance.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

}
