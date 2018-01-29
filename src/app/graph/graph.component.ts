import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  @Input() data: any;
  @Input() chartType = 'ColumnChart';
  chartData;
  @Input() title;
  constructor() { }
  ngOnInit() {
    this.chartData = {
      chartType: this.chartType,
      dataTable: this.data,
      options: { 'title': this.title, height: 200 },
    };
  }
  setGraph(graphType: string) {
    console.log(graphType);
    this.chartData = Object.create(this.chartData);
    this.chartData.chartType = graphType;
  }
}
