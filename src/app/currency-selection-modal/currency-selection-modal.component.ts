import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CurrencyService } from '@service/currency.service';
import { Http, Response, Headers } from '@angular/http';
import { Subject } from 'rxjs';

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

  onCryptoReady: Subject<any> = new Subject<any>()

  constructor(
    public currencyService: CurrencyService,
    private http: Http) {

    this.onCryptoReady.subscribe(() => {
      console.log('crypto ready')
      this.currencies.sort(function(a, b) {
        let textA = a.label.toUpperCase()
        let textB = b.label.toUpperCase()
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
      })
    })

    currencyService.onDisplayCurrencySelectorModal.subscribe(display => {
      this.display = display;

      setTimeout(() => {
        new window.Awesomplete(this.currenciesInput.nativeElement, {
          list: this.currencies
        })

        this.currenciesInput.nativeElement.addEventListener("awesomplete-select", function(event) {
          currencyService.code = event.text.value
        })
      }, 1000)

    })
  }

  ngOnInit() {

    this.getCryptoCurrencies()

    this.currencies = fiatCurrencies.map(item => {
      return {
        label: `${item.name} · ${item.cc} · ${item.symbol}`,
        value: `${item.symbol} `
      }
    })

  }

  setCurrencyCode(code: string){
    this.currencyService.code = code
  }

  getCryptoCurrencies() {
    let headers = new Headers();
    headers.append('Accept', 'application/json')

    this.http.get(this.cryptoCurrenciesEndpoint, {
      headers: headers
    }).toPromise()
      .then((res: any) => {
        let crypto = JSON.parse(res._body).data;

        this.addCryptoCurrencies(crypto)
      })
      .catch(error => console.log(error));
  }

  addCryptoCurrencies(crypto: Array<any>){
    if (crypto.length <= 0) {
      this.onCryptoReady.next(true)
      return false
    }

    let item = crypto.pop()

    this.currencies.push({
      label: `${item.name} · ${item.symbol}`,
      value: `${item.symbol} `
    })

    this.addCryptoCurrencies(crypto)
  }

}
