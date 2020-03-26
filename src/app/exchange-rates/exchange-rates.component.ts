import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';

import { UpperCasePipe, registerLocaleData } from '@angular/common';
import localeLv from '@angular/common/locales/lv';
import { ExchangeRatesService } from '../shared/services/exchange-rates.service';
import * as moment from 'moment';
registerLocaleData(localeLv, 'lv-LV');

@Component({
  selector: 'app-exchange-rates',
  templateUrl: './exchange-rates.component.html',
  styleUrls: ['./exchange-rates.component.scss']
})
export class ExchangeRatesComponent implements OnInit {

  public selectCurrencyForm: FormGroup;
  public defaultBase = 'EUR';
  public exchangeRates = [];
  public currencies: string[] = [];
  public daterange: any = {};
  public options: any = {
    startDate: moment(),
    weekStart: 1,
    locale: {
      format: 'DD/MM/YYYY',
      firstDay: 1
    },
    alwaysShowCalendars: true,
    singleDatePicker: !this.route.snapshot.paramMap.get('symbols')
  };
  public noResults = false;

  private symbols: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private upperCasePipe: UpperCasePipe,
    private exchangeRatesService: ExchangeRatesService,
  ) { }

  ngOnInit() {
    this.symbols = this.route.snapshot.paramMap.get('symbols') ?
      this.upperCasePipe.transform(this.route.snapshot.paramMap.get('symbols')) : this.defaultBase;

    this.exchangeRatesService.getLatest(this.symbols).pipe(take(1)).subscribe(res => {
      this.exchangeRates.push( { date: res.date, rates: res.rates } );
      Object.keys(res.rates).forEach(key => {
        this.currencies.push(key);
      });
      // Next line only here because API doesn't return a `rates.EUR` property if `base=EUR`. Go figure.
      if (this.currencies.indexOf(this.defaultBase) < 0) { this.currencies.push(this.defaultBase); }
      this.currencies.sort();
      document.querySelector('#loader').classList.add('fade-out');
    });
  }

  /**
   * Get currency exchange rates
   */
  public showHistory(symbols) {
    this.router.navigate(['/exchange-rates/' + symbols]);
  }

  /**
   * Check rates for specified currency
   */
  public checkRates(event: any) {
    document.querySelector('#loader').classList.remove('fade-out');
    this.exchangeRates = [];
    this.exchangeRatesService.getHistory(
      this.symbols,
      this.daterange.start,
      this.daterange.end).pipe(take(1)).subscribe(res => {
      this.noResults = Object.keys(res.rates).length === 0 && res.rates.constructor === Object;

      // tslint:disable-next-line:forin
      for (const key in res.rates) {
        this.exchangeRates.push( { date: key, rates: res.rates[key] } );
      }
      this.exchangeRates.sort((a, b) => {
        return a.date.localeCompare(b.date);
      });
      document.querySelector('#loader').classList.add('fade-out');
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

  /**
   * Datepicker filter out weekend dates (no rates available)
   */
  public myFilter = (d: Date): boolean => {
    const day = d.getDay();
    return day !== 0 && day !== 6;
  }

}
