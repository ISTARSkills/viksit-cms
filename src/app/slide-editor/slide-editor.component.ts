import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfiguration } from '../app.constants';
import { trigger, transition, style, animate, query, stagger, keyframes, state } from '@angular/animations';
import { WizardComponent } from 'ng2-archwizard';
import { Title } from '../pojo/slide/title';
import { Paragraph } from '../pojo/slide/paragraph';
import { Slide } from '../pojo/slide/slide';
@Component({
  selector: 'app-slide-editor',
  templateUrl: './slide-editor.component.html',
  styleUrls: ['./slide-editor.component.css']
})
export class SlideEditorComponent implements OnInit {

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

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
  newTitle: Title;
  newParagraph: Paragraph;
  slide: Slide;
  constructor(private sanitizer: DomSanitizer, private http: HttpClient) { }

  ngOnInit() {
    const local_complex_object = localStorage.getItem('currentUser')
    this.complex_object = JSON.parse(local_complex_object);

    this.templateTypePreviewList = [
      { presentation: ["Title_Paragraph", "Title", "Title_Paragraph_Image"] },
      { interactive: [] },
      { assessment: [] }]

    this.newTitle = new Title("", 1, "", 5)
    this.newParagraph = new Paragraph("", 2, "", 5)
    this.slide = new Slide(this.newTitle, this.newParagraph, "", "", "", this.switchexpression, null, 0);

    for (let list of this.templateTypePreviewList[0].presentation) {
      this.templateList.push(list)
      console.log(list);
    }

  }

  public onChangeTemplateType($event) {

    this.templateList = [];

    if ($event.target.value === "PRESENTATION") {
      for (let list of this.templateTypePreviewList[0].presentation) {
        this.templateList.push(list)
        console.log(list);
      }
    } else if ($event.target.value === "INTERACTIVE") {

      for (let list of this.templateTypePreviewList[0].interactive) {
        this.templateList.push(list)
      }

    } else if ($event.target.value === "ASSESSMENT") {

      for (let list of this.templateTypePreviewList[0].assessment) {
        this.templateList.push(list)
      }
    }

    console.log($event.target.value);
  }

  isClassVisible(newValue: number, template_type: string) {
    this.switchexpression = template_type
    this.isVisible = true;
    this.highlightedDiv = newValue;
    this.slide.type = template_type
    this.slide.fragmentcount = this.getFragmentCount(template_type);

    console.log(this.isVisible + " >> " + this.highlightedDiv + " >> " + this.switchexpression)
  }


  public getFragmentCount(type) {

    switch (type) {
      case 'Title_Paragraph':
        return 2;
      default:
        return 0;
    }

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
        this.progressWidth1 = 33;
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

}
