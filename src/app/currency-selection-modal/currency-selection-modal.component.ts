import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { CurrencyService } from '@service/currency.service';

declare var require: any
declare var document: any
declare var window: any

const _ = require('lodash')
const fiatCurrencies = require('assets/json/fiat-currencies.json')

@Component({
  selector: 'app-currency-selection-modal',
  templateUrl: './currency-selection-modal.component.html',
  styleUrls: ['./currency-selection-modal.component.css']
})

export class CurrencySelectionModalComponent implements OnInit {

  currenciesInput: any

  @ViewChild('currenciesInput') set input(input: ElementRef) {
    this.currenciesInput = input
  }


  display: boolean = false

  cryptoCurrenciesEndpoint: string = 'https://api.coinmarketcap.com/v2/listings/'
  // cryptoCurrenciesEndpoint: string = 'https://api.coinmarketcap.com/v1/ticker/'

  cryptoCurrencies: Array<any> = []

  hasLoadedCryptoCurrencies: boolean = false

  currencies: Array<any> = []

  constructor(
    public currencyService: CurrencyService,
    private http: Http) {
    currencyService.onDisplayCurrencySelectorModal.subscribe(display => {
      this.display = display;

      setTimeout(() => {
        this.getCryptoCurrencies();

        new window.Awesomplete(this.currenciesInput.nativeElement, {
          list: this.currencies
        });
      }, 1000)

    })
  }

  ngOnInit() {

    this.currencies = fiatCurrencies.map(item => {
      return {
        label: `${item.name} ${item.symbol}`,
        value: item.symbol
      }
    })

  }

  setCurrencyCode(){
    this.display = false
  }

  getCryptoCurrencies() {
    if (this.hasLoadedCryptoCurrencies) return false

    let headers = new Headers();
    headers.append('Accept', 'application/json')

    this.http.get(this.cryptoCurrenciesEndpoint, {
      headers: headers
    }).toPromise()
      .then((res: any) => {
        // console.log(JSON.parse(res._body));

        let data = JSON.parse(res._body).data;

        data.forEach(item => {
          this.currencies.push({
            label: `${item.name} ${item.symbol}`,
            value: item.symbol
          })
        })

        this.hasLoadedCryptoCurrencies = true
      })
      .catch(error => console.log(error));
  }

}
