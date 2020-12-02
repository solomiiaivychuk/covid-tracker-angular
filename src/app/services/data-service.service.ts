import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { GlobalDataSummary } from '../modals/global-data';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private globalDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/12-01-2020.csv';
  constructor(private http : HttpClient) { }

  getGlobalData() {
    return this.http.get(this.globalDataUrl, {responseType: 'text'}).pipe(
      map(result => {
        let data: GlobalDataSummary[] = [];
        let finalData: any = {};
        let rows = result.split('\n');
        rows.splice(0, 1);
        //console.log(rows);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/);
          let rawData = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10]
          }
          /**
           * if the country already exists =>
           * don't create new object,
           * just merge the data;
           * if the country does not exist => 
           * create new object
           */
          let countryObj: GlobalDataSummary = finalData[rawData.country];
          if (countryObj) {
            countryObj.confirmed = rawData.confirmed + Number(countryObj.confirmed);
            countryObj.deaths = rawData.deaths + Number(countryObj.deaths);
            countryObj.recovered = rawData.recovered + Number(countryObj.recovered);
            countryObj.active = rawData.active + Number(countryObj.active);
            finalData[rawData.country] = countryObj;
          } else {
            finalData[rawData.country] = rawData;
          }
        })
        //console.log(finalData);
        return <GlobalDataSummary[]>Object.values(finalData);
      })
    )
  }
}
