import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { CurrencyService } from '@service/currency.service';

declare var require: any

const awesomplete = require('awesomplete')
const _ = require('lodash')
const fiatCurrencies = require('assets/json/fiat-currencies.json')

@Component({
  selector: 'app-currency-selection-modal',
  templateUrl: './currency-selection-modal.component.html',
  styleUrls: ['./currency-selection-modal.component.css']
})
export class CurrencySelectionModalComponent implements OnInit {

  display: boolean = false

  // cryptoCurrenciesEndpoint: string = 'https://api.coinmarketcap.com/v2/listings'
  cryptoCurrenciesEndpoint: string = 'https://api.coinmarketcap.com/v1/ticker/'

  cryptoCurrencies: Array<any> = []

  currencies: Array<any> = []

  constructor(
    public currencyService: CurrencyService,
    private http: Http) {
    currencyService.onDisplayCurrencySelectorModal.subscribe(display => {
      this.display = display;
    })
  }

  ngOnInit() {
    this.getCryptoCurrencies();

    this.currencies = fiatCurrencies.map(item => {
      return {
        label: item.name,
        value: item.symbol
      }
    })
  }

  getCryptoCurrencies() {
    let headers = new Headers();
    headers.append('Accept', 'application/json')

    this.http.get(this.cryptoCurrenciesEndpoint, {
      headers: headers
    }).toPromise()
      .then((res: any) => {
        console.log(JSON.parse(res._body));
        let data = JSON.parse(res._body);
        data.forEach(item => {
          this.currencies.push({
            label: item.name,
            value: item.symbol
          })
        })
      })
      .catch(error => console.log(error));
  }

}
