import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-cards',
  templateUrl: './dashboard-cards.component.html',
  styleUrls: ['./dashboard-cards.component.css']
})
export class DashboardCardsComponent implements OnInit {

  @Input('totalConfirmed') totalConfirmed = 0;
  @Input('totalActive') totalActive = 0;
  @Input('totalDeaths') totalDeaths = 0;
  @Input('totalRecovered') totalRecovered = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
