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

  getInvoicesList(){
    return JSON.parse(localStorage.getItem('invoices'));
  }

  updateCurrentInvoice(data){
    let currentInvoice = this.getCurrentInvoice();

    let updatedInvoice = Object.assign(data, currentInvoice);

    localStorage.setItem(this.getCurrentInvoiceNumber(), JSON.stringify(updatedInvoice));
  }
}
