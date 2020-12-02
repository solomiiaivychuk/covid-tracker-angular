import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataInterface } from '../../interfaces/global-data-interface';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData!: GlobalDataInterface[];
  pieChart: GoogleChartInterface = {
    chartType : 'PieChart'
  };
  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart'
  }

  constructor(private dataService: DataServiceService) { }

  initChart(caseType: string) {

    let dataTable: any = [];
    let value: number = 0;
    dataTable.push(["Country", "Cases"]);
    this.globalData.forEach((countryData: any) => {
      if (caseType == 'confirmed') {
        value = countryData.confirmed;
      } else if(caseType == 'active') {
        value = countryData.active;
      } else if(caseType == 'deaths') {
        value = countryData.deaths;
      } else if(caseType == 'recovered') {
        value = countryData.recovered;
      }
      dataTable.push([countryData.country, value]);
    });
    //console.log(dataTable);
    this.pieChart = {
      chartType: 'PieChart',
      dataTable: dataTable,
      options: {
        width:500,
        height: 500,
        'Country': 'Cases'
      },
    };
    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: dataTable,
      options: {
        width: 500,
        height: 500,
        'Country': 'Cases'
      },
    };
  }
  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe(
      {
        next : (result) => {
          //console.log(result);
          this.globalData = result;
          result.forEach((country: any) => {
            if (!Number.isNaN(country.confirmed)) {
              this.totalActive += country.active;
              this.totalConfirmed += country.confirmed;
              this.totalDeaths += country.deaths;
              this.totalRecovered += country.recovered;
            }
          })
          this.initChart('confirmed');
        }
      });
  }
  updateChart(input : HTMLInputElement) {
    console.log(input.value);
    this.initChart(input.value);
  }

}
