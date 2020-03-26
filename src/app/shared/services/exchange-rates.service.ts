import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { UpperCasePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRatesService {

  private apiUrl = 'https://api.exchangeratesapi.io';

  constructor(
    private http: HttpClient,
    private upperCasePipe: UpperCasePipe,
  ) { }

  /**
   * getLatest
   */
  public getLatest(base: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/latest?base=${base}`);
  }

  /**
   * getLatest
   */
  public getHistory(base: string, start: string, end: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/history?
start_at=${moment(start).format('YYYY-MM-DD')}&
end_at=${moment(end).format('YYYY-MM-DD')}&
base=${this.upperCasePipe.transform(base)}`);
  }
}
