import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dashboard-content-admin',
  templateUrl: './dashboard-content-admin.component.html',
  styleUrls: ['./dashboard-content-admin.component.css']
})
export class DashboardContentAdminComponent implements OnInit {
  graphType = 'LineChart';
  columnChartData1;
  columnChartData2;
  graphData = [

    ['Time', 'Course 1', 'Course 2', 'Course 3', 'Course 4'],
    ['2018-03-11', 60, 55, 35, 0],
    ['2018-04-13', 30, 50, 10, 0],
    ['2018-05-14', 50, 20, 16, 0],
    ['2018-06-16', 55, 9, 30, 0],

  ];

  constructor() { }

  ngOnInit() {

  }

}
