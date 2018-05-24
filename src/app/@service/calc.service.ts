import { Injectable } from '@angular/core';

@Injectable()
export class CalcService {

  constructor() { }

  getSum(invoice: any): number {
    let sum = 0;

    for (let i = 0; i < invoice.items.length; i++) {
      sum += (invoice.items[i].quantity * invoice.items[i].rate);
    }

    return sum;
  }

  getTotal(invoice: any): number {
    let total = 0;

    if ( invoice.option.type === 'Flat ($)' ) {
      total = this.getSum(invoice) + parseFloat(invoice['option']['value']);
    } else {
      total = this.getSum(invoice) + ( this.getSum(invoice) * ( parseFloat(invoice['option']['value']) / 100 ) );
    }

    total -= invoice.paid;

    return total;
  }
}
