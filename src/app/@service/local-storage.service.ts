import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { }

  getCurrentInvoiceNumber(){
    return localStorage.getItem('currentInvoice') || '001';
  }

  getCurrentInvoice(){
    let number = this.getCurrentInvoiceNumber();

    return JSON.parse(localStorage.getItem(number));
  }
}
