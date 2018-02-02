import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-partial-course-list-item',
  templateUrl: './partial-course-list-item.component.html',
  styleUrls: ['./partial-course-list-item.component.css']
})
export class PartialCourseListItemComponent implements OnInit {
  @Input() data: any;

  constructor() { }

  ngOnInit() {
    console.log(this.data);
  }

}
