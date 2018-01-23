import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dashboard-content-admin',
  templateUrl: './dashboard-content-admin.component.html',
  styleUrls: ['./dashboard-content-admin.component.css']
})
export class DashboardContentAdminComponent implements OnInit {
  graphType = 'ColumnChart';
  columnChartData1;
  columnChartData2;

  constructor() { }

  ngOnInit() {
    this.columnChartData1 = {
      chartType: 'ColumnChart',
      dataTable: [
        ['Task', 'Hours per Day'],
        ['Work', 11],
        ['Eat', 2],
        ['Commute', 2],
        ['Watch TV', 2],
        ['Sleep', 7]
      ],
      options: { 'title': 'Tasks', height: 200 },
    };
    this.columnChartData2 = {
      chartType: 'ColumnChart',
      dataTable: [
        ['Task', 'Hours per Day'],
        ['Work', 11],
        ['Eat', 2],
        ['Commute', 2],
        ['Watch TV', 2],
        ['Sleep', 7]
      ],
      options: { 'title': 'Tasks', height: 200 },
    };
  }
  setGraph(graphType: string) {
    console.log(graphType);
    this.columnChartData1 = Object.create(this.columnChartData1);
    this.columnChartData1.chartType = graphType;
  }
  setGraph2(graphType: string) {
    this.columnChartData2 = Object.create(this.columnChartData2);
    this.columnChartData2.chartType = graphType;
  }
}
