import { Component, OnInit } from '@angular/core';
import { GlobalDataInterface } from 'src/app/modals/global-data-interface';
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
  constructor(private dataService: DataServiceService) { }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe(result => {
      this.countriesData = result;
      this.countriesData.forEach((countryData: any) => {
        this.countriesList.push(countryData.country);
      })
    })
  }
  updateValues(country: string) {
    console.log(country);
    this.countriesData.forEach((countryData: any) => {
      if(countryData.country == country) {
        
        this.totalConfirmed = countryData.confirmed;
        this.totalActive = countryData.active;
        this.totalDeaths = countryData.deaths;
        this.totalRecovered =countryData.recovered;
      }
    })
  }
}
