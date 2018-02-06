import { Component, OnInit } from '@angular/core';
import { Lesson } from '../pojo/lesson/lesson';

@Component({
  selector: 'app-lesson-builder-content-creator',
  templateUrl: './lesson-builder-content-creator.component.html',
  styleUrls: ['./lesson-builder-content-creator.component.css']
})
export class LessonBuilderContentCreatorComponent implements OnInit {
//lesson :Lesson;
lesson;
complex_object;
public isCollapsed = true;
  constructor() { }

  ngOnInit() {

    const local_complex_object = localStorage.getItem('currentUser')

    this.complex_object = JSON.parse(local_complex_object);
  console.log(">>>> "+ this.complex_object.studentProfile.firstName);

this.lesson = {
  id: null,
  name:"Java Intro",
  description:"Java is a programming language created by James Gosling from Sun Microsystems (Sun) in 1991",
  status:"INCOMPLETED", imageURL:"",
  type :"PRESENTATION"
  stages:[{
    name:"Java Intro 1",
    slides:[{
        name:"Java Intro 1.1",
        description:"Java is a programming language created by James Gosling from Sun Microsystems (Sun) in 1991",
        to:"Slide 1 / Slide 2",
        from:"Start"
    },{
        name:"Java Intro 1.2",
        description:"Java is a programming language created by James Gosling from Sun Microsystems (Sun) in 1991",
          to:"Slide 2 / Slide 3",
         from:"Slide 1 / Slide 2",
    }]
  },
  {
    name:"Java Intro 2",
    slides:[]
  }]
}

  }

public  addStageComponent(lesson){
  var stage = {

    name:"New Stage",
    slides:[]
  }
lesson.stages.push(stage);
  }

  public removeStageFunction = function (stage) {
    var index = this.lesson.stages.indexOf(stage);
    this.lesson.stages.splice(index, 1);
  };

  public removeSlideFunction(stage,slide){

    var stageIndex = this.lesson.stages.indexOf(stage);
    var slideIndex = this.lesson.stages[moduleIndex].sessions.indexOf(slide);
    this.lesson.stages[stageIndex].sessions.splice(slideIndex, 1);
  };

  public addSlideComponent = function (stage) {
    var index = this.lesson.stages.indexOf(stage);
    var slide = {
       name:"New Slide",
       description:"N/A",
        to:"N/A",
       from:"N/A",
    }
    this.lesson.stages[index].slides.push(slide);

  };

}
