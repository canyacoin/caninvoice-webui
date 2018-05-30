import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class CurrencyService {

  code: string = 'US$ '

  onDisplayCurrencySelectorModal: Subject<any> = new Subject<any>()

  constructor() { }

  displayCurrencySelectorModal(){
    this.onDisplayCurrencySelectorModal.next(true);
  }

}
