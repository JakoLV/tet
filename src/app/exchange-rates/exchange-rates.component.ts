import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

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
  public datepickerOptions: any;

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
    return this.http.get(`https://api.exchangeratesapi.io/latest?base=${this.upperCasePipe.transform(symbols)}`);
  }

  /**
   * Check rates for specified currency
   */
  public checkRates(event: any) {
    console.log(event.target.value);
    this.getRates(event.target.value).subscribe(res => {
      this.exchangeRates = res;
    });
  }

}
