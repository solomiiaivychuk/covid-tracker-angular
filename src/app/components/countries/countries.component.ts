import { Component, OnInit } from '@angular/core';
import { GlobalDataSummary } from 'src/app/modals/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})

export class CountriesComponent implements OnInit {

  countriesData!: GlobalDataSummary[];
  countriesList: string[] = [];
  constructor(private dataService: DataServiceService) { }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe(result => {
      this.countriesData = result;
      this.countriesData.forEach((countryData: any) => {
        this.countriesList.push(countryData.country);
      })
    })
  }

}
