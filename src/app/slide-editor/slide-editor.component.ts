import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfiguration } from '../app.constants';
import { trigger, transition, style, animate, query, stagger, keyframes, state } from '@angular/animations';
import { WizardComponent } from 'ng2-archwizard';
import { Title } from '../pojo/slide/title';
import { Paragraph } from '../pojo/slide/paragraph';
import { Slide } from '../pojo/slide/slide';
import { LessonBuilderServiceService } from '../services/lesson_bulider/lesson-builder-service.service';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { SlideBuilderServiceService } from '../services/slide_builder/slide-builder-service.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'app-slide-editor',
  templateUrl: './slide-editor.component.html',
  styleUrls: ['./slide-editor.component.css']
})
export class SlideEditorComponent implements OnInit {

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
  @ViewChild('paragraphview') paragraphview;
  @ViewChild('titleview') titleview;

  public isVisible = false;
  highlightedDiv: number;
  switchexpression = "";
  progress = 50;
  isOn = true;
  isDisabled = false;
  progressWidth1 = 0;
  progressWidth2 = 0;
  currentprogress = 0;
  complex_object;
  templateTypePreviewList = [];
  templateList = [];
  isInclude2ndStep = false;
  selectedType = "PRESENTATION"
  slide: Slide;
  index;
  stage;
  lesson;
  public loading = false;
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private sideValidator: SlideBuilderServiceService, private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer,
    private http: HttpClient, private lessonBuilderService: LessonBuilderServiceService) {
    this.index = this.route.snapshot.params.index;
    this.stage = this.route.snapshot.params.id;
  }

  ngOnInit() {


    const local_complex_object = localStorage.getItem('currentUser')
    this.complex_object = JSON.parse(local_complex_object);
    this.templateTypePreviewList = [
      { presentation: ["LESSON_INTRODUCTION_CARD", "TITLE_PARAGRAPH_CARD", "IMAGE_TITLE_PARAGRAPH_CARD", "ONLY_VIDEO", "VIDEO_TITLE_PARA_CARD", "NO_CONTENT", "TITLE_IMAGE_PARAGRAPH_CARD", "IMAGE_PARAGRAPH_CARD", "ONLY_TITLE", "ONLY_2BOX", "ONLY_2TITLE", "ONLY_2TITLE_IMAGE", "ONLY_LIST", "ONLY_LIST_NUMBERED", "ONLY_TITLE_IMAGE", "ONLY_TITLE_PARAGRAPH_IMAGE", "ONLY_TITLE_PARAGRAPH", "ONLY_PARAGRAPH", "ONLY_PARAGRAPH_IMAGE"] },
      { interactive: ["LESSON_INTRODUCTION_CARD", "TITLE_PARAGRAPH_CARD", "IMAGE_TITLE_PARAGRAPH_CARD", "INTERACTIVE_2_CROSS_2", "INTERACTIVE_3_CROSS_2", "ONLY_VIDEO", "VIDEO_TITLE_PARA_CARD", "INTERACTIVE_CARDS_LIST", "NO_CONTENT", "TITLE_IMAGE_PARAGRAPH_CARD", "IMAGE_PARAGRAPH_CARD", "INTERACTIVE_2_CROSS_1", "AUDIO_SPEECH_CARD", "AUDIO_TITLE_IMAGE_PARAGRAPH_CARD", "DRAGGABLE_CARD_1", "DRAGGABLE_CARD_2", "DRAGGABLE_CARD_3", "DRAGGABLE_CARD_4", "DRAGGABLE_CARD_5", "ONLY_TITLE", "ONLY_2BOX", "ONLY_2TITLE", "ONLY_2TITLE_IMAGE", "ONLY_LIST", "ONLY_LIST_NUMBERED", "ONLY_TITLE_IMAGE", "ONLY_TITLE_PARAGRAPH_IMAGE", "ONLY_TITLE_PARAGRAPH", "ONLY_PARAGRAPH", "ONLY_PARAGRAPH_IMAGE", "ASSESSMENT_TYPE_1"] }]

    this.lessonBuilderService.getAllSlide().takeUntil(this.ngUnsubscribe).subscribe(data => {
      this.lesson = data;
      this.slide = this.lesson.stages[this.stage].slides[this.index]


      var count = 0;
      if (this.lesson.type === 'PRESENTATION_INTERACTIVE' || this.lesson.type === 'INTERACTIVE') {

        for (let list of this.templateTypePreviewList[1].interactive) {
          if (this.slide != null && this.slide.type === list) {
            this.isClassVisible(count, this.slide.type)
          }
          count++;
          this.templateList.push(list)
        }

      } else if (this.lesson.type === 'PRESENTATION') {

        for (let list of this.templateTypePreviewList[0].presentation) {
          if (this.slide != null && this.slide.type === list) {
            this.isClassVisible(count, this.slide.type)
          }
          count++;
          this.templateList.push(list)
        }

      }

    });

  }

  public onChangeTemplateType($event) {

    this.templateList = [];

    if ($event.target.value === "PRESENTATION") {
      for (let list of this.templateTypePreviewList[0].presentation) {
        this.templateList.push(list)
        // console.log(list);
      }
    } else if ($event.target.value === "INTERACTIVE") {

      for (let list of this.templateTypePreviewList[1].interactive) {
        this.templateList.push(list)
      }

    } else if ($event.target.value === "ASSESSMENT") {

      for (let list of this.templateTypePreviewList[2].assessment) {
        this.templateList.push(list)
      }
    }

    // console.log($event.target.value);
  }

  isClassVisible(newValue: number, template_type: string) {
    // console.log(template_type);
    this.switchexpression = template_type
    this.isVisible = true;
    this.highlightedDiv = newValue;
    this.slide.type = template_type
    this.slide.fragmentcount = this.getFragmentCount(template_type);

    //  console.log(this.slide);
    //  console.log(this.isVisible + " >> " + this.highlightedDiv + " >> " + this.switchexpression)
  }



  public getFragmentCount(type) {

    switch (type) {
      case 'TITLE_PARAGRAPH_CARD':
        return 1;
      case 'IMAGE_TITLE_PARAGRAPH_CARD':
        return 2;
      case 'LESSON_INTRODUCTION_CARD':
        return 1;
      case 'INTERACTIVE_2_CROSS_2':
        return 1;
      case 'INTERACTIVE_3_CROSS_2':
        return 1;
      case 'ONLY_VIDEO':
        return 0;
      case 'VIDEO_TITLE_PARA_CARD':
        return 0;
      case 'INTERACTIVE_CARDS_LIST':
        return 0;
      case 'NO_CONTENT':
        return 0;
      case 'TITLE_IMAGE_PARAGRAPH_CARD':
        return 2;
      case 'IMAGE_PARAGRAPH_CARD':
        return 1;
      case 'INTERACTIVE_2_CROSS_1':
        return 1;
      case "AUDIO_SPEECH_CARD":
        return 0;
      case "AUDIO_TITLE_IMAGE_PARAGRAPH_CARD":
        return 1;
      case "SLIDE_EVALUATION_CARD":
        return 1;
      case "DRAGGABLE_CARD_1":
        return 1;
      case "DRAGGABLE_CARD_2":
        return 1;
      case "DRAGGABLE_CARD_3":
        return 1;
      case "DRAGGABLE_CARD_3":
        return 1;
      case "DRAGGABLE_CARD_4":
        return 1;
      case "DRAGGABLE_CARD_5":
        return 1;
      case "ONLY_TITLE":
        return 0;
      case "ONLY_2BOX":
        return 3;
      case "ONLY_2TITLE":
        return 1;
      case "ONLY_2TITLE_IMAGE":
        return 2;
      case "ONLY_LIST":
        return 5;
      case "ONLY_LIST_NUMBERED":
        return 5;
      case "ONLY_TITLE_IMAGE":
        return 1;
      case "ONLY_TITLE_PARAGRAPH_IMAGE":
        return 2;
      case "ONLY_TITLE_TREE":
        return 2;
      case "ONLY_TITLE_PARAGRAPH":
        return 1;
      case "ONLY_PARAGRAPH":
        return 0;
      case "ONLY_PARAGRAPH_IMAGE":
        return 1;
      default:
        return 0;
    }

  }

  finishFunction() {

    this.loading = true;

    //console.log('save called>>');
    //console.log(this.lesson);
    const body = new HttpParams().set('lesson_object', JSON.stringify(this.lesson));
    this.http.post(AppConfiguration.ServerWithApiUrl + 'lesson/1/save_slides/' + this.lesson.id, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    }).takeUntil(this.ngUnsubscribe).subscribe(res => {
      //  console.log(res)
      this.lesson = res['data']
      this.loading = false;
      this.router.navigate(['/lesson_builder/' + this.lesson.id], { relativeTo: this.route });
    });
  }

  isValidForm() {


    return this.sideValidator.isValidateSlide(this.slide);

  }

  enterSecondStep($event) {

    if (this.wizard != undefined) {
      //console.log(this.wizard.model.currentStepIndex);
      this.currentprogress = this.wizard.model.currentStepIndex;
      if (this.wizard.model.currentStepIndex == 0) {
        this.progressWidth1 = 0;
        this.progressWidth2 = 0;
        this.isOn = true;
      }
      if (this.wizard.model.currentStepIndex == 1) {
        this.isInclude2ndStep = true;
        this.progressWidth1 = 50;
        this.progressWidth2 = 0;
        this.isOn = true;
        this.isDisabled = true;
      } if (this.wizard.model.currentStepIndex == 2) {

        this.progressWidth2 = 34;
        this.isOn = true;
        this.isDisabled = true;
      }

    } else {
      //console.log(this.wizard);
      this.progressWidth1 = 0;
      this.progressWidth2 = 0;
      this.currentprogress = 0;
      this.isOn = true;
    }
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log("unsubscribe");
  }
}
