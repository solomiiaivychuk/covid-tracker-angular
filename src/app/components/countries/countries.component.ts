import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { DateWiseData } from 'src/app/interfaces/datewise-data-interface';
import { GlobalDataInterface } from 'src/app/interfaces/global-data-interface';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})

export class CountriesComponent implements OnInit {

  countriesData!: GlobalDataInterface[];
  countriesList: string[] = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  casesByCountriesAndDates!: any;
  selectedCountryCases!: DateWiseData[];
  lineChart: GoogleChartInterface = {
    chartType: 'LineChart'
  };

  constructor(private dataService: DataServiceService) { }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe(result => {
      this.countriesData = result;
      this.countriesData.forEach((countryData: any) => {
        this.countriesList.push(countryData.country);
      })
    });

    this.dataService.getDateWiseData().subscribe(result => {
      this.casesByCountriesAndDates = result;
      //this.updateChart();
    })
  }
  updateValues(country: string) {
    this.countriesData.forEach((countryData: any) => {
      if(countryData.country == country) {
        this.totalConfirmed = countryData.confirmed;
        this.totalActive = countryData.active;
        this.totalDeaths = countryData.deaths;
        this.totalRecovered =countryData.recovered;
      }
    })
    this.selectedCountryCases = this.casesByCountriesAndDates[country];
    this.selectedCountryCases.sort((a: any, b: any) => Date.parse(b.date) - Date.parse(a.date));
    this.updateChart();
  }

  updateChart() {
    let dataTable = [];
    dataTable.push(['Date', 'Cases']);
    this.selectedCountryCases.forEach((cs) => {
      dataTable.push([cs.date, cs.cases]);
    })

    this.lineChart = {
      chartType: 'LineChart',
      dataTable: dataTable,
      options: {'Date': 'Cases'},
    };
  }
}
