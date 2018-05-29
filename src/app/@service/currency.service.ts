import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class CurrencyService {

  code: string = 'USD '

  onDisplayCurrencySelectorModal: Subject<any> = new Subject<any>()

  constructor() { }

  displayCurrencySelectorModal(){
    this.onDisplayCurrencySelectorModal.next(true);
  }

}
