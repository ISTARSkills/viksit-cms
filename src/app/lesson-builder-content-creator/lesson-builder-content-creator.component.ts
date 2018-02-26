import { Component, OnInit, ViewChild } from '@angular/core';
import { Lesson } from '../pojo/lesson/lesson';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfiguration } from '../app.constants';
import { LessonBuilderServiceService } from '../services/lesson_bulider/lesson-builder-service.service';
import { Title } from '../pojo/slide/title';
import { Paragraph } from '../pojo/slide/paragraph';
import { Slide } from '../pojo/slide/slide';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { List } from '../pojo/slide/list';
import { SubTitle } from '../pojo/slide/subtitle';
import { Image } from '../pojo/slide/image';

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
  @ViewChild('mobilePreview') mobilePreview;
  currentModalInstance: any;
  closeResult: string;
  stageindex
  newTitle: Title;
  newParagraph: Paragraph
  newList: List
  slide: Slide
  subTitle: SubTitle
  @ViewChild('imageview') imageview;
  @ViewChild('paragraphview') paragraphview;
  @ViewChild('titleview') titleview;
  audio = new Audio();
  paragraph_delay = 0;
  title_delay = 0;
  image
  mobilePreviewIsVisible = true;
  public onPlayDisable = false;
  title_fragment_duration;
  paragraph_fragment_duration;
  fgImage
  image_fragment_duration
  paragraph_text;
  title_text;
  bgImage;
  bgcolor;
  slidePreviewPosition = 0;
  image_delay = 0;
  selectSlideType = "TITLE_PARAGRAPH_CARD";
  options: NgbModalOptions = {
    size: 'lg',
    windowClass: 'animated bounceInUp',
  };
  constructor(private modalService: NgbModal, private router: Router, private route: ActivatedRoute, private http: HttpClient, private lessonBuilderService: LessonBuilderServiceService) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit() {

    const local_complex_object = localStorage.getItem('currentUser')

    this.complex_object = JSON.parse(local_complex_object);
    //console.log(">>>> " + this.complex_object.studentProfile.firstName);


    if (this.id != undefined) {
      this.loading = true;
      const req = this.lessonBuilderService.getlessonDetails(this.id);
      req.subscribe(
        data => {
          this.lessonBuilderService.lessonSave(data['data'])
          this.lessonBuilderService.currentLesson.subscribe(lesson => this.lesson = lesson)
          //console.log("lesson");
          //console.log(this.lesson);
          this.loading = false;
        },
        err => {
          console.log('Something went wrong!');
        }
      );

    }

  }

  public mobilePreviewFunction(action) {

    if (action === 'show') {
      this.mobilePreviewIsVisible = false;
      this.mobilePreview.nativeElement.classList.add("slideInRight");
    } else {
      this.mobilePreviewIsVisible = true;
      this.mobilePreview.nativeElement.classList.remove("slideInRight");
    }

  }

  public startPreview(slidePreviewPosition) {
    let slide = null;
    this.bgImage = "none";
    this.bgcolor = "";
    this.fgImage = "none"
    slide = this.lesson.stages[slidePreviewPosition].slides[0];
    this.title_fragment_duration = slide.title.fragment_duration;
    this.paragraph_fragment_duration = slide.paragraph.fragment_duration;

    if (slide.image != undefined) {
      this.fgImage = slide.image.url;
      this.image_fragment_duration = slide.image.fragment_duration;
    }

    this.paragraph_text = slide.paragraph.text;
    this.title_text = slide.title.text;
    this.audio.src = slide.audioUrl;
    if (slide.audioUrl != '' && slide.audioUrl != 'none') {
      this.audio.load();
      this.audio.play();
    }

    if (slide.bgImage != '') {
      this.bgImage = slide.bgImage;
    }
    this.bgcolor = slide.color
    if (slide.paragraph.fragment_order == 1) {
      this.paragraph_delay = 0;
      this.title_delay = slide.paragraph.fragment_duration;
    } else {
      this.paragraph_delay = slide.title.fragment_duration;
      this.title_delay = 0;
    }

    if (slide.paragraph.transition_type != '') {
      this.paragraphview.nativeElement.classList.add(slide.paragraph.transition_type);
    }
    if (slide.title.transition_type != '') {
      this.titleview.nativeElement.classList.add(slide.title.transition_type);
    }
    var totalDuration = parseInt(slide.paragraph.fragment_duration) + parseInt(slide.title.fragment_duration);

    setTimeout(() => {

      if (slide.paragraph.transition_type != '') {
        this.paragraphview.nativeElement.classList.remove(slide.paragraph.transition_type);
      }
      if (slide.title.transition_type != '') {
        this.titleview.nativeElement.classList.remove(slide.title.transition_type);
      }

      if (slidePreviewPosition < (this.lesson.stages.length - 1)) {
        this.startPreview(slidePreviewPosition + 1)
      } else {
        this.onPlayDisable = false;
      }


    }, totalDuration);

  }


  public playPreview() {
    this.slidePreviewPosition = 0;
    this.onPlayDisable = true;
    this.startPreview(this.slidePreviewPosition);
  }

  public getFragmentCount(type) {

    switch (type) {
      case 'ONLY_TITLE_PARAGRAPH_NEW':
        return 1;
      default:
        return 0;
    }

  }

  public getNewSlide(index) {

    var lists = Array();
    this.newTitle = new Title("", 1, "", 500)
    this.newParagraph = new Paragraph("", 2, "", 500)
    for (let i = 0; i < 5; i++) {
      this.newList = new List("", "", i);
      lists.push(this.newList);
    }
    this.image = new Image("", 1, "", 500);
    this.subTitle = new SubTitle("", 1, "", 500)
    this.slide = new Slide(this.newTitle, this.newParagraph, this.image, "", "", this.selectSlideType, null, this.getFragmentCount(this.selectSlideType), this.lesson.stages.length, "", lists, this.subTitle);
    this.lesson.stages[index].slides.push(this.slide);
    //console.log(this.lesson)
    sessionStorage.setItem('lesson', JSON.stringify(this.lesson));
    // this.currentModalInstance.close();
  }

  saveEndExitClicked() {

    this.loading = true;
    //console.log('save called>>');
    const body = new HttpParams().set('lesson_object', JSON.stringify(this.lesson));
    this.http.post(AppConfiguration.ServerWithApiUrl + 'lesson/1/save_slides/' + this.lesson.id, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    }).subscribe(res => {
      //console.log(res)
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
    //console.log(this.lesson);
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

  public addSlideComponent = function (index) {

    console.log(index);
    this.getNewSlide(index)
    this.router.navigate(['/slide_editor/' + index], { relativeTo: this.route });
    // this.modalName = "Create " + "Slide";
    // this.type = "PRESENTATION";
    // this.stageindex = this.lesson.stages.indexOf(stage);
    // this.currentModalInstance = this.modalService.open(content, this.options);
    // this.currentModalInstance.result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });

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
