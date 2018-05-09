import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit {

  // currentUser: any = JSON.parse( localStorage.getItem('credentials') );

  currentInvoice = JSON.parse( localStorage.getItem( localStorage.getItem('currentInvoice') || '001') );
  @Input() state = 'loading';
  @Input() invoicesList: any = [];
  @Output() invoiceSelected: EventEmitter<any> = new EventEmitter();
  @Output() print: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit() {
    console.log('TopComponent - ngOnInit', this.currentInvoice, this.invoicesList);
  }

  onSelectInvoice(event: any) {
    this.currentInvoice = event;
    console.log('onSelectInvoice', this.currentInvoice);
    this.invoiceSelected.emit(event);
  }

  onPrint(event: any) {
    this.print.emit(event);
  }
}
