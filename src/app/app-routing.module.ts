import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExchangeRatesComponent } from './exchange-rates/exchange-rates.component';


const routes: Routes = [
  {
    path: 'exchange-rates/:symbols', component: ExchangeRatesComponent,
  },
  {
    path: '',
    redirectTo: '/exchange-rates',
    pathMatch: 'full'
  },
  { path: '**', component: ExchangeRatesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
