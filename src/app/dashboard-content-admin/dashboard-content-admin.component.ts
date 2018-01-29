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
  graphData = [['Chart thing', 'Chart amount'],
  ['Lorem ipsum', 60],
  ['Dolor sit', 22],
  ['Sit amet', 18]];

  constructor() { }

  ngOnInit() {

  }

}
