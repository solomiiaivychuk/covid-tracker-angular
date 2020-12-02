import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalDataInterface } from '../interfaces/global-data-interface';
import { DateWiseData } from '../interfaces/datewise-data-interface';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private globalDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/12-01-2020.csv';
  private globalDataDatewiseUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
  constructor(private http : HttpClient) { }

  getGlobalData() {
    return this.http.get(this.globalDataUrl, {responseType: 'text'}).pipe(
      map(result => {
        let data: GlobalDataInterface[] = [];
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
          let countryObj: GlobalDataInterface = finalData[rawData.country];
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
        return <GlobalDataInterface[]>Object.values(finalData);
      })
    )
  }
  /**
   * map through data
   * get header values for chart
   * splice rows of the header  by comma to  get every date separately
   * split cases by comma to get array with number of cases
   * create object with the country name as a key
   * and an object as a value :
   * Country: {
   *  country: country,
   *  date: date,
   *  cases: cases
   *  }
   */
  getDateWiseData() {
    return this.http.get(this.globalDataDatewiseUrl, {responseType: 'text'})
    .pipe(map((result: any)=> {
      let rows = result.split('\n');
      let casesObj: any = {};
      let header = rows[0];
      let dates = header.split(/,(?=\S)/);
      dates .splice(0, 4);
      rows.splice(0, 1);
      rows.forEach((row: any) => {
        let cases = row.split(/,(?=\S)/);
        let country = cases[1];
        cases.splice(0, 4);
        casesObj[country] = [];
        cases.forEach((value: any, index: any) => {
          let casesByCountryAndDate: DateWiseData = {
            country: country,
            cases: +value,
            date: new Date(Date.parse(dates[index]))
          }
          casesObj[country].push(casesByCountryAndDate);
        })
      })
      return casesObj;
    }))

  }
}
