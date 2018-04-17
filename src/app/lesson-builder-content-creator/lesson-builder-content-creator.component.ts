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
import { InteractiveList } from '../pojo/slide/interactivelist';
import { Question } from '../pojo/assessment/question';
import { Option } from '../pojo/assessment/option';
declare var require: any;
const swal = require('sweetalert2');

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
  newInteractiveList: InteractiveList
  slide: Slide
  subTitle: SubTitle
  question: Question;
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

    if (this.lesson.type === 'ASSESSMENT') {
      this.playAssessmentPreview()
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

  public startAssessmentPreview(slidePreviewPosition) {

    console.log(slidePreviewPosition);
    this.question = this.lesson.stages[slidePreviewPosition];

  }

  public nextAssessmentPreview() {

    this.slidePreviewPosition = this.slidePreviewPosition + 1;

    if (this.slidePreviewPosition <= (this.lesson.stages.length - 1)) {
      this.startAssessmentPreview(this.slidePreviewPosition);
    }

  }

  public previewAssessmentPreview() {

    this.slidePreviewPosition = this.slidePreviewPosition - 1;

    if (this.slidePreviewPosition >= 0) {
      this.startAssessmentPreview(this.slidePreviewPosition);
    }

  }

  public playAssessmentPreview() {
    this.onPlayDisable = true;
    this.slidePreviewPosition = 0;
    this.startAssessmentPreview(this.slidePreviewPosition);

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
    var learning_objectives = Array();
    var interactivelists = Array();
    this.newTitle = new Title("", 1, "none", 500);
    this.newParagraph = new Paragraph("", 2, "none", 500);
    this.image = new Image("", 3, "none", 500);
    for (let i = 0; i < 16; i++) {
      this.newList = new List("", "", i);
      this.newInteractiveList = new InteractiveList("", "", i, this.image, "", false, 0, 0, false, -1, "Bounce")
      lists.push(this.newList);
      interactivelists.push(this.newInteractiveList);
    }


    this.subTitle = new SubTitle("", 1, "none", 500)




    this.slide = new Slide(this.newTitle, this.newParagraph, this.image, "", "", this.selectSlideType, null, this.getFragmentCount(this.selectSlideType), slide_order_id, "", lists, this.subTitle, interactivelists, index, learning_objectives);
    this.lesson.stages[index].slides.push(this.slide);

    var slide_order_id = 1;
    for (var i = 0; i < this.lesson.stages.length; i++) {
      for (let slide of this.lesson.stages[i].slides) {
        slide.order_id = slide_order_id;
        slide_order_id++;
      }
    }



    console.log(this.lesson.stages[index].slides.length)
    sessionStorage.setItem('lesson', JSON.stringify(this.lesson));
    // this.currentModalInstance.close();

    return this.lesson.stages[index].slides.length - 1;
  }

  ignore(event: Event) {
    event.stopPropagation();
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

  public addStageForQuestionComponent(lesson) {

    var options = Array();
    var learning_objectives = Array();
    for (let i = 0; i < 4; i++) {
      let option = new Option(null, false, "");
      options.push(option);
    }
    this.question = new Question(null, "", "", "60", options, learning_objectives);
    this.lesson.stages.push(this.question);
    sessionStorage.setItem('lesson', JSON.stringify(this.lesson));
    this.router.navigate(['/assessment_editor/' + (this.lesson.stages.length - 1)], { relativeTo: this.route });
  }

  public removeStageFunction = function (stage) {
    swal({
      title: 'Are you sure?',
      text: "Do you want to delete this stage?",
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
        var index = this.lesson.stages.indexOf(stage);
        this.lesson.stages.splice(index, 1);
        this.setAllStageIndex();




        sessionStorage.setItem('lesson', JSON.stringify(this.lesson));
        swal(
          'Done',
          'Stage deleted successfully',
          'success'
        )
      } else if (
        // Read more about handling dismissals
        result.dismiss === swal.DismissReason.cancel
      ) {
        swal(
          'Cancelled',
          'Your stage is safe!',
          'error'
        )
      }
    });
  };

  public setAllStageIndex() {
    var slide_order_id = 1;
    for (var i = 0; i < this.lesson.stages.length; i++) {
      this.lesson.stages[i].name = 'Stage ' + (i + 1);
      for (let slide of this.lesson.stages[i].slides) {
        slide.order_id = slide_order_id;

        slide.stage_id = slide_order_id;

        slide_order_id++;
      }
    }
  }

  public removeSlideFunction(stage, slide) {
    swal({
      title: 'Are you sure?',
      text: "Do you want to delete this slide?",
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
        var stageIndex = this.lesson.stages.indexOf(stage);
        var slideIndex = this.lesson.stages[stageIndex].slides.indexOf(slide);
        this.lesson.stages[stageIndex].slides.splice(slideIndex, 1);
        this.setAllStageIndex();
        sessionStorage.setItem('lesson', JSON.stringify(this.lesson));
        swal(
          'Done',
          'Slide deleted successfully',
          'success'
        )
      } else if (
        // Read more about handling dismissals
        result.dismiss === swal.DismissReason.cancel
      ) {
        swal(
          'Cancelled',
          'Your slide is safe!',
          'error'
        )
      }
    });
  };

  public addSlideComponent = function (index) {

    console.log(index);
    let currentIndx = this.getNewSlide(index)
    this.router.navigate(['/slide_editor/' + index + '/' + currentIndx], { relativeTo: this.route });

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
