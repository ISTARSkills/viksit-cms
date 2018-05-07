import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LessonBuilderServiceService } from '../../services/lesson_bulider/lesson-builder-service.service';
import { Observable } from 'rxjs/Observable';
import { Skill } from '../../pojo/skill/skill';

@Component({
  selector: 'app-assessment-template',
  templateUrl: './assessment-template.component.html',
  styleUrls: ['./assessment-template.component.css']
})
export class AssessmentTemplateComponent implements OnInit {

  @Input() switchexpression;
  @Input() question;
  @Input() lessonId
  isCorrect1Option = false;
  isCorrect2Option = false;
  isCorrect3Option = false;
  isCorrect4Option = false;
  isMultiSelect = false;
  closeResult: string;
  skills$: Observable<Skill[]>;
  selectedskillId;
  constructor(private modalService: NgbModal, private lessonBuilderService: LessonBuilderServiceService) { }

  ngOnInit() {


    this.lessonBuilderService.getSkill();


    if (this.question.type === 'MULTIPLE_CHOICE' || this.question.type === 'MULTIPLE_CHOICE_WITH_PARA') {
      this.isMultiSelect = true;
    }

    if (this.question.type === 'Essay_Type_Question') {
      this.question.options[0].marking_schema = true;
    }

  }

  ignore(event: Event) {
    event.stopPropagation();
  }

  onChangeSkill(event) {

    console.log(event);
    if (event != null) {
      this.question.learning_objectives.push(event);

    }
  }

  addSkill(skillName) {

    console.log(skillName);
    if (skillName.trim() != "") {
      this.question.learning_objectives.push({ id: null, name: skillName });

    }

  }


  openLg(content) {

    this.modalService.open(content, { size: 'lg' });

    this.skills$ = this.lessonBuilderService.getSkillForQuestions();

    console.log(this.skills$);

  }


  public isCorrectOptionFunction(option: string) {

    console.log(this.isMultiSelect);

    if (this.isMultiSelect === false) {

      for (let option of this.question.options) {
        option.marking_schema = false;
      }

      if (option === '1') {
        this.question.options[0].marking_schema = true;
      } else if (option === '2') {
        this.question.options[1].marking_schema = true;
      } else if (option === '3') {
        this.question.options[2].marking_schema = true;
      } else if (option === '4') {
        this.question.options[3].marking_schema = true;
      }

    } else if (this.isMultiSelect === true) {

      if (option === '1') {
        this.question.options[0].marking_schema = true;
      } else if (option === '2') {
        this.question.options[1].marking_schema = true;
      } else if (option === '3') {
        this.question.options[2].marking_schema = true;
      } else if (option === '4') {
        this.question.options[3].marking_schema = true;
      }

    }

  }

}
