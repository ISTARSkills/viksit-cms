import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { trigger, transition, style, animate, query, stagger, keyframes, state, page } from '@angular/animations';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { AppConfiguration } from '../../../app.constants';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Slide } from '../../../pojo/slide/slide';
import { Title } from '../../../pojo/slide/title';
import { Paragraph } from '../../../pojo/slide/paragraph';


@Component({
  selector: 'app-presentation-templates',
  templateUrl: './presentation-templates.component.html',
  styleUrls: ['./presentation-templates.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('* => in', [
        animate(3000, keyframes([
          style({ opacity: 0, transform: 'translateX(-100%)', offset: 0 }),
          style({ opacity: 0.1, transform: 'translateX(15px)', offset: 0.3 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
        ]))
      ]),
      transition('* => void', [
        animate(3000, keyframes([
          style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(-15px)', offset: 0.7 }),
          style({ opacity: 0, transform: 'translateX(100%)', offset: 1.0 })
        ]))
      ])
    ]),
    trigger('FadeInDown', [
      state('bottom', style({ transform: 'translateX(0)' })),
      transition('* => void', [
        animate(3000, keyframes([
          style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(-15px)', offset: 0.7 }),
          style({ opacity: 0, transform: 'translateX(100%)', offset: 1.0 })
        ]))
      ]),
      transition('* => bottom', [
        animate(3000, keyframes([
          style({ opacity: 0, transform: 'translateY(100%)', offset: 0 }),
          style({ opacity: 0.1, transform: 'translateY(-15px)', offset: 0.7 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 })
        ]))
      ])
    ])
  ]
})
export class PresentationTemplatesComponent implements OnInit {
  @Input() switchexpression;
  @Input() slide;
  @ViewChild('paragraphview') paragraphview;
  @ViewChild('titleview') titleview;
  item_id;
  item_type = "SLIDE_CREATION";
  state: string = '';
  public color: string = '#7e7970';
  public bgcolor: string = '#FFFFFF';
  //public tempImg: SafeStyle;
  public title: string = ""
  public paragraph: string = ""
  public bgImage: string = "";
  public flyInOut1 = "flyInOut"
  title_fragment_order = 1;
  paragraph_fragment_order = 2;
  paragraph_transaction_style = "fadeinbottom";
  title_transaction_style = "fadein";
  paragraph_transaction_duration = 5;
  title_transaction_duration = 5;
  duration = '5s';
  delay = '0s';
  constructor(private sanitizer: DomSanitizer, private http: HttpClient) { }

  animateMe() {

    this.state = (this.state === 'in' ? 'bottom' : 'in');
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
    console.log(color);
    this.bgcolor = color;
    this.slide.bgColor = this.bgcolor;
  }

  public getParagraph(text) {
    return text;

  }
  public onChangeImage(event) {

    console.log(event.srcElement.value);
    console.log(event.target.files[0]);
    console.log(event);
    const files: Array<File> = event.target.files;
    const formData: any = new FormData();
    var headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.set('Accept', 'application/json');

    formData.append("item_type", 'SLIDE_EDITOR');
    formData.append("item_id", '0');
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i], files[i]['name']);
    }
    console.log('form data variable :   ' + formData.toString());


    this.http.post(AppConfiguration.ServerWithApiUrl + 'image/upload', formData)
      .subscribe(res => {
        console.log('response files res', res);
        this.bgImage = res.toString();
        this.slide.bgImage = this.bgImage;
      }, error => {
        console.log('response files error', error);
        console.log('response files error', error.error.text);
        this.bgImage = error.error.text;
        this.slide.bgImage = this.bgImage;
      });

  }

  ngOnInit() {
    console.log("switchexpression " + this.switchexpression)
    console.log(this.slide);


  }

}
