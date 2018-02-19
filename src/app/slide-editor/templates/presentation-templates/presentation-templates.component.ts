import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate, query, stagger, keyframes, state } from '@angular/animations';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { AppConfiguration } from '../../../app.constants';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Slide } from '../../../pojo/slide/slide';
import { Title } from '../../../pojo/slide/title';
import { Paragraph } from '../../../pojo/slide/paragraph';


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
  item_id;
  item_type = "SLIDE_CREATION";
  state: string = '';
  audio = new Audio();
  public color: string = '#7e7970';
  public bgcolor: string = '#FFFFFF';
  public audioUrl: string = "";
  public bgImage: string = "";
  public loading = false;
  paragraph_delay = 0;
  title_delay = 0;
  public onPlayDisable = false;
  constructor(private sanitizer: DomSanitizer, private http: HttpClient) { }

  animateMe() {
    this.onPlayDisable = true;
    this.audio.load();
    this.audio.play();

    if (this.slide.paragraph.fragment_order == 1) {
      this.paragraph_delay = 0;
      this.title_delay = this.slide.paragraph.fragment_duration;
    } else {
      this.paragraph_delay = this.slide.title.fragment_duration;;
      this.title_delay = 0;
    }


    this.paragraphview.nativeElement.classList.add(this.slide.paragraph.transition_type);
    this.titleview.nativeElement.classList.add(this.slide.title.transition_type);

    var totalDuration = this.slide.paragraph.fragment_duration + this.slide.title.fragment_duration;
    setTimeout(() => {
      this.titleview.nativeElement.classList.remove(this.slide.title.transition_type);
      this.paragraphview.nativeElement.classList.remove(this.slide.paragraph.transition_type);
      this.onPlayDisable = false;

    }, totalDuration);


  }

  public playPreview() {
    this.paragraphview.nativeElement.classList.remove("fadeinbottom");
    this.titleview.nativeElement.classList.remove("fadein");

    setTimeout(function () {
      this.paragraphview.nativeElement.classList.add("fadeinbottom");
      this.titleview.nativeElement.classList.add("fadein");
    }.bind(this), 100);

  }

  onChangeColor(color) {
    //  console.log(color);
    this.bgcolor = color;
    this.slide.color = this.bgcolor;
  }

  public getParagraph(text) {
    return text;

  }

  onChangeAudio(event) {

    // console.log(event.target.files[0]);
    const files: Array<File> = event.target.files;
    const formData: any = new FormData();
    var headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.set('Accept', 'application/json');

    formData.append("item_type", 'SLIDE_EDITOR');
    formData.append("item_id", this.lessonId);
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i], files[i]['name']);
    }
    // console.log('form data variable :   ' + formData.toString());
    this.loading = true;

    this.http.post(AppConfiguration.ServerWithApiUrl + 'image/upload', formData)
      .subscribe(res => {
        //  console.log('response files res', res);
        this.audioUrl = res.toString();
        this.slide.audioUrl = this.bgImage;
        this.audio.src = this.slide.audioUrl;
        this.loading = false;
      }, error => {
        //  console.log('response files error', error);
        //   console.log('response files error', error.error.text);
        this.audioUrl = error.error.text;
        this.slide.audioUrl = this.audioUrl;
        this.audio.src = this.slide.audioUrl;
        this.loading = false;
      });

  }


  public onChangeImage(event) {

    // console.log(event.srcElement.value);
    //  console.log(event.target.files[0]);
    //  console.log(event);
    const files: Array<File> = event.target.files;
    const formData: any = new FormData();
    var headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.set('Accept', 'application/json');

    formData.append("item_type", 'SLIDE_EDITOR');
    formData.append("item_id", this.lessonId);
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i], files[i]['name']);
    }
    //  console.log('form data variable :   ' + formData.toString());
    this.loading = true;

    this.http.post(AppConfiguration.ServerWithApiUrl + 'image/upload', formData)
      .subscribe(res => {
        //  console.log('response files res', res);
        this.bgImage = res.toString();
        this.slide.bgImage = this.bgImage;
        this.loading = false;
      }, error => {
        //  console.log('response files error', error);
        //  console.log('response files error', error.error.text);
        this.bgImage = error.error.text;
        this.slide.bgImage = this.bgImage;
        this.loading = false;
      });

  }

  ngOnInit() {
    // console.log("switchexpression " + this.switchexpression)
    //  console.log(this.slide);
    this.bgImage = this.slide.bgImage;
    //  console.log("lessonId " + this.lessonId)
    this.bgcolor = this.slide.color;

    if (this.slide.color != null && this.slide.color.trim() != '' && this.slide.color != 'null') {
      this.color = this.slide.color;
    }

    if (this.slide.audioUrl != null && this.slide.audioUrl.trim() != '' && this.slide.audioUrl != 'null') {
      this.audio.src = this.slide.audioUrl;
    }
  }

}
