import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';

import { UpperCasePipe, registerLocaleData } from '@angular/common';
import localeLv from '@angular/common/locales/lv';
registerLocaleData(localeLv, 'lv-LV');

@Component({
  selector: 'app-exchange-rates',
  templateUrl: './exchange-rates.component.html',
  styleUrls: ['./exchange-rates.component.scss']
})
export class ExchangeRatesComponent implements OnInit {

  public selectCurrencyForm: FormGroup;
  public exchangeRates: any;
  public currencies: [];
  public daterange: any = {};
  public options: any = {
    locale: { format: 'DD/MM/YYYY' },
    alwaysShowCalendars: true,
  };

  private symbols: string;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private upperCasePipe: UpperCasePipe,
  ) { }

  ngOnInit() {
    this.symbols = this.route.snapshot.paramMap.get('symbols') ?
      this.upperCasePipe.transform(this.route.snapshot.paramMap.get('symbols')) : 'EUR';

    this.getRates(this.symbols).subscribe(res => {
      this.exchangeRates = res;
    });
  }

  /**
   * Get currency exchange rates
   */
  public getRates(symbols: any): Observable<any> {
    this.symbols = this.upperCasePipe.transform(symbols);
    if (!this.daterange.start) {
      return this.http.get(`https://api.exchangeratesapi.io/latest?base=${this.upperCasePipe.transform(symbols)}`);
    } else {
      return this.http.get(`https://api.exchangeratesapi.io/history?
start_at=${moment(this.daterange.start).format('YYYY-MM-DD')}&
end_at=${moment(this.daterange.end).format('YYYY-MM-DD')}&
base=${this.upperCasePipe.transform(symbols)}`);
    }
  }

  /**
   * Check rates for specified currency
   */
  public checkRates(event: any) {
    this.getRates(!!event ? this.symbols : event.target.value).subscribe(res => {
      this.exchangeRates = res;
      console.log(res.rates);
      
    });
  }

  /**
   * Datepicker date change method
   */
  public selectedDate(value: any, datepicker?: any) {
    datepicker.start = value.start;
    datepicker.end = value.end;

    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;
  }

}
