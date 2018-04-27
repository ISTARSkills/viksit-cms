import { Component, OnInit, ViewChild } from '@angular/core';
import { WizardComponent } from 'ng2-archwizard';
import { Question } from '../pojo/assessment/question';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { LessonBuilderServiceService } from '../services/lesson_bulider/lesson-builder-service.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfiguration } from '../app.constants';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'app-assessment-builder',
  templateUrl: './assessment-builder.component.html',
  styleUrls: ['./assessment-builder.component.css']
})
export class AssessmentBuilderComponent implements OnInit {
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
  templateList = ["SINGLE_CHOICE", "MULTIPLE_CHOICE", "SINGLE_CHOICE_WITH_PARA", "MULTIPLE_CHOICE_WITH_PARA"];
  progressWidth1 = 0;
  progressWidth2 = 0;
  currentprogress = 0;
  switchexpression = "";
  progress = 50;
  isOn = true;
  isInclude2ndStep = false;
  isDisabled = false;
  complex_object;
  isVisible = false;
  highlightedDiv: number;
  question: Question;
  questions: any;
  stage;
  lesson;
  public loading = false;
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private lessonBuilderService: LessonBuilderServiceService) {
    this.stage = this.route.snapshot.params.id;
  }

  ngOnInit() {

    const local_complex_object = localStorage.getItem('currentUser')
    this.complex_object = JSON.parse(local_complex_object);


    this.lessonBuilderService.getAllSlide().subscribe(data => {
      this.lesson = data;
      this.questions = [];
      var count = 0;
      this.question = this.lesson.stages[this.stage];
      console.log(this.question);

      for (let list of this.templateList) {
        if (this.question != null && this.question.type === list) {
          this.isClassVisible(count, this.question.type)
        }
        count++;
      }


    });

  }

  isValidForm() {
    return true;
  }

  isClassVisible(newValue: number, template_type: string) {
    console.log(template_type);
    this.switchexpression = template_type
    this.isVisible = true;
    this.highlightedDiv = newValue;
    this.question.type = template_type
  }


  finishFunction() {

    this.loading = true;

    console.log('save called>>');
    console.log(this.lesson);
    const body = new HttpParams().set('lesson_object', JSON.stringify(this.lesson));
    this.http.post(AppConfiguration.ServerWithApiUrl + 'lesson/1/save_assessment/' + this.lesson.id, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    }).takeUntil(this.ngUnsubscribe).subscribe(res => {
      //  console.log(res)
      this.lesson = res['data']
      this.loading = false;
      this.router.navigate(['/lesson_builder/' + this.lesson.id], { relativeTo: this.route });
    });
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
