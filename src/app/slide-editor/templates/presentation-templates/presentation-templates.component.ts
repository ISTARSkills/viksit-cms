import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate, query, stagger, keyframes, state } from '@angular/animations';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { AppConfiguration } from '../../../app.constants';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Slide } from '../../../pojo/slide/slide';
import { Title } from '../../../pojo/slide/title';
import { Paragraph } from '../../../pojo/slide/paragraph';
import { LessonBuilderServiceService } from '../../../services/lesson_bulider/lesson-builder-service.service';
import { PlayPresentationService } from '../../../services/playpresentation/play-presentation-service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Skill } from '../../../pojo/skill/skill';
import { List } from '../../../pojo/slide/list';
import { InteractiveList } from '../../../pojo/slide/interactivelist';
import { CMSImage } from '../../../pojo/slide/image';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-presentation-templates',
  templateUrl: './presentation-templates.component.html',
  styleUrls: ['./presentation-templates.component.css']
})
export class PresentationTemplatesComponent implements OnInit {
  @Input() switchexpression;
  @Input() slide;
  @Output() updatedslide;
  @Input() lessonId
  @Output() slideChange: EventEmitter<Slide> = new EventEmitter<Slide>();
  @ViewChild('paragraphview') paragraphview;
  @ViewChild('titleview') titleview;
  @ViewChild('imageview') imageview;
  item_id;
  item_type = "SLIDE_CREATION";
  lessonType = "";
  state: string = '';
  audio = new Audio();
  public color: string = '#7e7970';
  public bgcolor: string = '#FFFFFF';
  public audioUrl: string = "";
  public bgImage: string = "";
  public videoUrl: string = '';
  public g1Image: string = "";
  public g2gImage: string = "";
  public g3Image: string = "";
  public g4Image: string = "";
  public fgImage: string = "";
  public loading = false;
  isCorrect1Option = false;
  isCorrect2Option = false;
  isCorrect3Option = false;
  isCorrect4Option = false;
  isMultiSelect = false;
  textcolor = '#7e7970'
  paragraph_delay = 0;
  audio_delay = 0;
  image_delay = 0;
  editorValue;
  title_delay = 0;
  public onPlayDisable = false;
  someValue = 2;
  totalDuration = 0;
  destinationslideIds: any;
  skills$: Observable<Skill[]>;
  selectedskillId;
  selectGrid = 4;
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private modalService: NgbModal, private playppt: PlayPresentationService, private sanitizer: DomSanitizer, private http: HttpClient, private lessonBuilderService: LessonBuilderServiceService) { }

  getFragmentOrdering() {

    switch (this.switchexpression) {
      case 'TITLE_PARAGRAPH_CARD':
        this.totalDuration = parseInt(this.slide.paragraph.fragment_duration) + parseInt(this.slide.title.fragment_duration);
        if (this.slide.paragraph.fragment_order == 1) {
          this.paragraph_delay = 0;
          this.title_delay = this.slide.paragraph.fragment_duration;
        } else {
          this.paragraph_delay = this.slide.title.fragment_duration;;
          this.title_delay = 0;
        }
        break;
      case 'IMAGE_TITLE_PARAGRAPH_CARD':
        this.totalDuration = parseInt(this.slide.paragraph.fragment_duration) + parseInt(this.slide.title.fragment_duration) + parseInt(this.slide.image.fragment_duration);
        if (this.slide.title.fragment_order == 1 && this.slide.paragraph.fragment_order == 2 && this.slide.image.fragment_order == 3) {
          this.title_delay = 0;
          this.paragraph_delay = this.slide.title.fragment_duration;
          this.image_delay = parseInt(this.slide.paragraph.fragment_duration) + parseInt(this.slide.title.fragment_duration);

        } else if (this.slide.title.fragment_order == 2 && this.slide.paragraph.fragment_order == 1 && this.slide.image.fragment_order == 3) {
          this.paragraph_delay = 0;
          this.title_delay = this.slide.paragraph.fragment_duration;
          this.image_delay = parseInt(this.slide.title.fragment_duration) + parseInt(this.slide.paragraph.fragment_duration)

        } else if (this.slide.title.fragment_order == 2 && this.slide.paragraph.fragment_order == 3 && this.slide.image.fragment_order == 1) {
          this.image_delay = 0;
          this.title_delay = this.slide.image.fragment_duration;
          this.paragraph_delay = parseInt(this.slide.title.fragment_duration) + parseInt(this.slide.image.fragment_duration)

        }
        break;
      case 'LESSON_INTRODUCTION_CARD':
        break;
      case 'NO_CONTENT':
        //console.log("this.audio_delay" + this.audio_delay)
        this.totalDuration = this.audio_delay;
        break;
      case 'INTERACTIVE_2_CROSS_2':
        break;
      default:
        break;
    }

  }

  playFragmentAudio(value: string) {
    var index = parseInt(value);
    this.playppt.playPresentation(this.slide.interactivelist[index])

  }
  animateMe() {
    this.onPlayDisable = true;
    if (this.slide.audioUrl != null && this.slide.audioUrl != undefined && this.slide.audioUrl != '') {
      this.audio.src = this.slide.audioUrl;
      this.audio.load();
      this.audio.play();
      this.audio.ontimeupdate = () => {
        this.audio_delay = this.audio.duration * 1000;
      }
    }


    this.getFragmentOrdering();



    if (this.slide.paragraph != null && this.slide.paragraph.transition_type != '' && this.slide.paragraph.transition_type != 'none') {
      this.paragraphview.nativeElement.classList.add(this.slide.paragraph.transition_type);
    }
    if (this.slide.title != null && this.slide.title.transition_type != '' && this.slide.title.transition_type != 'none') {
      this.titleview.nativeElement.classList.add(this.slide.title.transition_type);
    }
    if (this.slide.image != null && this.slide.image.transition_type != '' && this.slide.image.transition_type != 'none') {
      this.imageview.nativeElement.classList.add(this.slide.image.transition_type);
    }

    //console.log("<<<<<<<<<<<<<<<<<" + this.totalDuration);
    setTimeout(() => {
      if (this.slide.paragraph != null && this.slide.paragraph.transition_type != '' && this.slide.paragraph.transition_type != 'none') {
        this.paragraphview.nativeElement.classList.remove(this.slide.paragraph.transition_type);
      }
      if (this.slide.title != null && this.slide.title.transition_type != '' && this.slide.title.transition_type != 'none') {
        this.titleview.nativeElement.classList.remove(this.slide.title.transition_type);
      }

      if (this.slide.image != null && this.slide.image.transition_type != '' && this.slide.image.transition_type != 'none') {
        this.imageview.nativeElement.classList.remove(this.slide.image.transition_type);
      }

      this.onPlayDisable = false;
      //console.log(this.onPlayDisable);
    }, this.totalDuration);


  }

  onChangeColor(color) {
    this.bgcolor = color;
    this.slide.color = this.bgcolor;
  }

  onTextChangeColor(color) {
    //console.log(color);
    this.textcolor = color;
    this.slide.fontColor = this.textcolor;
  }

  onDestinationSlideChange(destination_slide) {
    //console.log(destination_slide);
    this.slide.destination_slide = destination_slide;
  }

  public getParagraph(text) {
    return text;

  }

  onChangeAudio(event) {

    // console.log(event.target.files[0]);
    const files: Array<File> = event.target.files;
    const formData: any = new FormData();
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.set('Accept', 'application/json');
    headers.set('responseType', 'text');

    formData.append("item_type", 'SLIDE_EDITOR');
    formData.append("item_id", this.lessonId);
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i], files[i]['name']);
    }
    // console.log('form data variable :   ' + formData.toString());
    this.loading = true;

    this.http.post(AppConfiguration.ServerWithApiUrl + 'image/upload', formData, { headers: headers, responseType: 'text' }).takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        //  console.log('response files res', res);
        this.audioUrl = res.toString();
        this.slide.audioUrl = this.audioUrl;
        // this.audio.src = this.slide.audioUrl;
        this.loading = false;
      }, error => {
        //  console.log('response files error', error);
        //   console.log('response files error', error.error.text);
        this.audioUrl = error.error.text;
        this.slide.audioUrl = this.audioUrl;
        // this.audio.src = this.slide.audioUrl;
        this.loading = false;
      });

  }
  public onChangeForgroundImage(event) {
    const files: Array<File> = event.target.files;
    const formData: any = new FormData();
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.set('Accept', 'application/json');
    headers.set('responseType', 'text');
    formData.append("item_type", 'SLIDE_EDITOR');
    formData.append("item_id", this.lessonId);
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i], files[i]['name']);
    }
    this.loading = true;

    this.http.post(AppConfiguration.ServerWithApiUrl + 'image/upload', formData, { headers: headers, responseType: 'text' }).takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        this.fgImage = res.toString();
        this.slide.image.url = this.fgImage;
        this.loading = false;
      }, error => {

        this.fgImage = error.error.text;
        this.slide.image.url = this.fgImage;
        this.loading = false;
      });

    // console.log(this.slide);

  }


  public onChangeVideo(event) {
    const files: Array<File> = event.target.files;
    const formData: any = new FormData();
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.set('Accept', 'application/json');
    headers.set('responseType', 'text');
    formData.append("item_type", 'SLIDE_EDITOR');
    formData.append("item_id", this.lessonId);
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i], files[i]['name']);
    }
    this.loading = true;

    this.http.post(AppConfiguration.ServerWithApiUrl + 'image/upload', formData, { headers: headers, responseType: 'text' }).takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        this.videoUrl = res.toString();
        this.slide.videoUrl = this.videoUrl;
        this.loading = false;
      }, error => {

        this.videoUrl = error.error.text;
        this.slide.videoUrl = this.videoUrl;
        this.loading = false;
      });
    //console.log(this.slide);

  }

  public onChangeImage(event) {



    const files: Array<File> = event.target.files;
    const formData: any = new FormData();
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.set('Accept', 'application/json');
    headers.set('responseType', 'text');
    formData.append("item_type", 'SLIDE_EDITOR');
    formData.append("item_id", this.lessonId);
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i], files[i]['name']);
    }
    this.loading = true;

    this.http.post(AppConfiguration.ServerWithApiUrl + 'image/upload', formData, { headers: headers, responseType: 'text' }).takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        this.bgImage = res.toString();
        this.slide.bgImage = this.bgImage;
        this.loading = false;
      }, error => {

        this.bgImage = error.error.text;
        this.slide.bgImage = this.bgImage;
        this.loading = false;
      });

  }

  ignore(event: Event) {
    //event.preventDefault();
    event.stopPropagation();
  }

  onChangeGridImage(event, gridIndex) {

    //console.log(event);

    const files: Array<File> = event.target.files;
    const formData: any = new FormData();
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.set('Accept', 'application/json');
    headers.set('responseType', 'text');

    formData.append("item_type", 'SLIDE_EDITOR');
    formData.append("item_id", this.lessonId);
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i], files[i]['name']);
    }
    this.loading = true;

    this.http.post(AppConfiguration.ServerWithApiUrl + 'image/upload', formData, { headers: headers, responseType: 'text' }).takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        this.getGridByIndexForImage(gridIndex, res.toString())
        this.loading = false;
      }, error => {
        this.getGridByIndexForImage(gridIndex, error.error.text)
        this.loading = false;
      });

  }

  getitems() {
    let temp = Array<any>();
    for (let i = 0; i < this.selectGrid; i++) {
      temp.push(i);
    }
    return temp;
  }

  onChangeGridAudio(event, gridIndex) {

    // console.log(event.target.files[0]);
    const files: Array<File> = event.target.files;
    const formData: any = new FormData();
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.set('Accept', 'application/json');
    headers.set('responseType', 'text');

    formData.append("item_type", 'SLIDE_EDITOR');
    formData.append("item_id", this.lessonId);
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i], files[i]['name']);
    }
    // console.log('form data variable :   ' + formData.toString());
    this.loading = true;

    this.http.post(AppConfiguration.ServerWithApiUrl + 'image/upload', formData, { headers: headers, responseType: 'text' }).takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        this.getGridByIndexForAudio(gridIndex, res.toString())
        this.loading = false;
      }, error => {
        this.getGridByIndexForAudio(gridIndex, error.error.text)
        this.loading = false;
      });

  }
  getGridByIndexForImage(gridIndex, imageUrl) {

    this.slide.interactivelist[gridIndex].image.url = imageUrl;

  }

  getGridByIndexForAudio(gridIndex, audioUrl) {

    this.slide.interactivelist[gridIndex].fragmentAudioUrl = audioUrl;

  }

  public isDestinationSlideVisible() {

    if (this.lessonType === 'PRESENTATION') {
      return false;
    } else {
      return true;
    }

  }

  ngOnInit() {
    // console.log("switchexpression " + this.switchexpression);
    // console.log(this.slide);
    this.lessonBuilderService.getSkill();
    this.bgImage = this.slide.bgImage;
    //  console.log("lessonId " + this.lessonId)
    this.bgcolor = this.slide.color;



    this.lessonBuilderService.getAllSlide().takeUntil(this.ngUnsubscribe).subscribe(data => {
      this.destinationslideIds = [];

      this.lessonType = data.type;
      for (let stage of data.stages) {
        var count = 1;
        for (let slide of stage.slides) {
          // console.log(slide.id);
          if (slide.id != null) {
            this.destinationslideIds.push({ id: slide.id, name: 'stage ' + (slide.stage_id + 1) + '- slide ' + (count++) });
          }

        }
      }
      // console.log(this.destinationslideIds);
    });

    if (this.slide.image != null && this.slide.image.url.trim() != '' && this.slide.image.url != 'null') {
      this.fgImage = this.slide.image.url;
    }


    if (this.slide.color != null && this.slide.color.trim() != '' && this.slide.color != 'null') {
      this.color = this.slide.color;
    }

    if (this.slide.fontColor != null && this.slide.fontColor.trim() != '' && this.slide.fontColor != 'null') {
      this.textcolor = this.slide.fontColor;
    }



    /*   if (this.slide.audioUrl != null && this.slide.audioUrl.trim() != '' && this.slide.audioUrl != 'null') {
        this.audio.src = this.slide.audioUrl;
      } */
    if (this.switchexpression === 'LESSON_INTRODUCTION_CARD') {
      this.onPlayDisable = true;
    }

    if (this.switchexpression === 'INTERACTIVE_2_CROSS_2') {


    } else if (this.switchexpression === 'INTERACTIVE_3_CROSS_2') {

    }
    if (this.slide.interactivelist != null && this.slide.interactivelist[0].isMultiSelect != null) {
      this.isMultiSelect = this.slide.interactivelist[0].isMultiSelect;
      this.selectGrid = Math.sqrt(this.slide.interactivelist.length);
    }


  }

  public onChangeDestinationslideId(event, gridIndex) {
    //console.log(event);
    //console.log(gridIndex);
    this.getGridByIndexForDestinationSlide(gridIndex, event)
  }

  onChangeSkill(event) {

    // console.log(event);
    if (event != null) {
      this.slide.learning_objectives.push(event);

    }
  }

  addSkill(skillName) {

    //console.log(skillName);
    if (skillName.trim() != "") {
      this.slide.learning_objectives.push({ id: null, name: skillName });

    }

  }

  getGridByIndexForDestinationSlide(gridIndex, slideId) {

    switch (gridIndex) {
      case '1':
        this.slide.interactivelist[0].destination_slide = slideId;
        break;
      case '2':
        this.slide.interactivelist[1].destination_slide = slideId;
        break;
      case '3':
        this.slide.interactivelist[2].destination_slide = slideId;
        break;
      case '4':
        this.slide.interactivelist[3].destination_slide = slideId;
        break;
      case '5':
        this.slide.interactivelist[4].destination_slide = slideId;
        break;
      case '6':
        this.slide.interactivelist[5].destination_slide = slideId;
        break;
      case '7':
        this.slide.interactivelist[6].destination_slide = slideId;
        break;
      case '8':
        this.slide.interactivelist[7].destination_slide = slideId;
        break;
      case '9':
        this.slide.interactivelist[8].destination_slide = slideId;
        break;
      default:
        break;
    }

  }

  selectGridFunction(event) {

    //console.log(event);
    //console.log(this.selectGrid);
    this.slide.interactivelist = []
    var interactivelists = Array();

    if (event == 2) {
      for (let i = 0; i < 4; i++) {
        let image = new CMSImage("", 3, "none", 500);
        let newInteractiveList = new InteractiveList("", "", i, image, "", false, 0, 0, false, -1, "Bounce")
        this.slide.interactivelist.push(newInteractiveList);
      }
    } else if (event == 3) {
      for (let i = 0; i < 9; i++) {
        let image = new CMSImage("", 3, "none", 500);
        let newInteractiveList = new InteractiveList("", "", i, image, "", false, 0, 0, false, -1, "Bounce")
        this.slide.interactivelist.push(newInteractiveList);
      }
    } else if (event == 4) {
      for (let i = 0; i < 16; i++) {
        let image = new CMSImage("", 3, "none", 500);
        let newInteractiveList = new InteractiveList("", "", i, image, "", false, 0, 0, false, -1, "Bounce")
        this.slide.interactivelist.push(newInteractiveList);
      }
    }
    //console.log(this.slide);

  }

  openLg(content) {

    this.modalService.open(content, { size: 'lg' });

    this.skills$ = this.lessonBuilderService.getSkillForQuestions();

    //console.log(this.skills$);

  }

  public isMultiSelectFunction() {

    this.isMultiSelect = !this.isMultiSelect;

  }

  public isCorrectOptionFunction(option: string) {

    //console.log(this.isMultiSelect);

    if (this.isMultiSelect === false) {

      for (let interactive of this.slide.interactivelist) {
        interactive.isCorrectOption = false;
        interactive.isMultiSelect = false;
      }

      if (option == '1') {
        this.slide.interactivelist[0].isCorrectOption = true;
        //console.log(this.slide.interactivelist[1].isCorrectOption);
      } else if (option == '2') {
        this.slide.interactivelist[1].isCorrectOption = true;
      } else if (option == '3') {
        this.slide.interactivelist[2].isCorrectOption = true;
      } else if (option == '4') {
        this.slide.interactivelist[3].isCorrectOption = true;
      } else if (option == '5') {
        this.slide.interactivelist[4].isCorrectOption = true;
      } else if (option == '6') {
        this.slide.interactivelist[5].isCorrectOption = true;
      } else if (option == '7') {
        this.slide.interactivelist[6].isCorrectOption = true;
      } else if (option == '8') {
        this.slide.interactivelist[7].isCorrectOption = true;
      } else if (option == '9') {
        this.slide.interactivelist[8].isCorrectOption = true;
      }

    } else if (this.isMultiSelect === true) {

      for (let interactive of this.slide.interactivelist) {
        interactive.isMultiSelect = true;
      }

      if (option == '1') {
        this.slide.interactivelist[0].isCorrectOption = true;
      } else if (option == '2') {
        this.slide.interactivelist[1].isCorrectOption = true;
      } else if (option == '3') {
        this.slide.interactivelist[2].isCorrectOption = true;
      } else if (option == '4') {
        this.slide.interactivelist[3].isCorrectOption = true;
      } else if (option == '5') {
        this.slide.interactivelist[4].isCorrectOption = true;
      } else if (option == '6') {
        this.slide.interactivelist[5].isCorrectOption = true;
      } else if (option == '7') {
        this.slide.interactivelist[6].isCorrectOption = true;
      } else if (option == '8') {
        this.slide.interactivelist[7].isCorrectOption = true;
      } else if (option == '9') {
        this.slide.interactivelist[8].isCorrectOption = true;
      }

    }
    // console.log(this.slide);

  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log("unsubscribe");
  }
}
